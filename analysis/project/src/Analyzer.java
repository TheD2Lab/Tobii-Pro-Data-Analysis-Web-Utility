
import java.util.Arrays;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import java.util.stream.Collectors;


public class Analyzer implements Runnable {

	public Analyzer(TobiiExport export, String name) {
		this.export = export;
		this.name = name;
		data = new HashMap<String, Object>();
	}
	
	
	public String getName() {
		return name;
	}
	
	
	public Map<String, Object> getData() {
		return data;
	}
	
	
	@SuppressWarnings("unchecked")
	public void putAllSamples(Map<String, Object> map, String column, String name) {
		
		String[] timestamps = export.getColumn(TobiiExport.EYE_TRACKER_TIMESTAMP);
		String[] samples = export.getColumn(column);
		
		Map<String, Object> sampleMap = new HashMap<>();
		
		for (int i = 0; i < timestamps.length; i++) {
			if (samples[i].equals("")) { 
				// Do not add empty recordings.
			}
			else {
				sampleMap.put(timestamps[i], samples[i]);
			}
		}
		
		Map<String, Object> metricMap = (Map<String, Object>) map.get(name);
		metricMap.put("Samples", sampleMap);
	}
	
	
	public void putAllSamples(Map<String, Object> map, String column) {
		putAllSamples(map, column, column);
	}
	
	
	@SuppressWarnings("unchecked")
	public void analyze() {
		
		if (metrics == null) return;
		
		for (int i = 0; i < metrics.length; i++) {
			String metric = metrics[i];
			String unit = units[i];
			addStats(data, metric, metric, isValid);
			putAllSamples(data, metric);
			Map<String, Object> sampleMap = (Map<String, Object>)data.get(metric);
			sampleMap.put("units", unit);
		}
	}

	
	public void addCountStats(Map<String, Object> map) {
		map.put("Count", export.getSampleCount());
	}
	
	public void addStats(Map<String, Object> map, String column, String key) {
		addStats(map, column, key, isValid);
	}
	
	
	public void addStats(Map<String, Object> map, String column, String key, Predicate<String> isValid) {
		
		double[] samples = Arrays.stream(this.export.getColumn(column))
				.filter(isValid)
				.mapToDouble(Double::parseDouble)
				.toArray();
		
		addStats(map, key, samples);
	}
	
	
	public void addStats(Map<String, Object> map, String key, double[] samples) {
	
		Map<String, Object> statMap = new HashMap<>();
		
		statMap.put("DescriptiveStats", DescriptiveStats.getAllStats(samples));
		
		map.put(key, statMap);
	}
	
	
	public static <T> List<T> extractSampleValues(List<Sample<T>> samples) {
		return samples.stream()
				.map(s -> s.getValue())
				.collect(Collectors.toList());
	}
	
	@Override
	public void run() {
		analyze();
	}
	
	protected String name;
	protected TobiiExport export;
	protected String[] metrics;
	protected String[] units;
	protected Predicate<String> isValid = (s -> !s.isEmpty());
	protected Map<String, Object> data;

}
