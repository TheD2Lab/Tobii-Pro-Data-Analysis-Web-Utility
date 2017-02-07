
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Predicate;

public class Analyzer {

	public Analyzer(TobiiExport export, String name) {
		this.export = export;
		this.name = name;
	}
	
	@SuppressWarnings("unchecked")
	public void putAllSamples(Map<String, Object> map, String column) {
		
		String[] timestamps = export.getColumn(TobiiExport.EYE_TRACKER_TIMESTAMP);
		String[] samples = export.getColumn(column);
		
		Map<String, Object> sampleMap = new HashMap<>();
		
		for (int i = 0; i < timestamps.length; i++) {
			sampleMap.put(timestamps[i], samples[i]);
		}
		
		Map<String, Object> metricMap = (Map<String, Object>) map.get(column);
		metricMap.put("Samples", sampleMap);
	}
	
	public void addAllStats(Map<String, Object> map) {
		
		if (metrics == null) return;
		
		Map<String, Object> statMap = new HashMap<>();
		
		for (String metric : metrics) {
			addStats(statMap, metric, isValid);
			putAllSamples(statMap, metric);
		}
		
		map.put(name, statMap);
	}

	public void addCountStats(Map<String, Object> map) {
		map.put("Count", export.getSampleCount());
	}
	
	
	public void addStats(Map<String, Object> map, String column) {
		addStats(map, column, isValid);
	}
	
	
	public void addStats(Map<String, Object> map, String column, Predicate<String> isValid) {
		
		double[] samples = Arrays.stream(this.export.getColumn(column))
				.filter(isValid)
				.mapToDouble(Double::parseDouble)
				.toArray();
		
		addStats(map, column, samples);
	}
	
	public void addStats(Map<String, Object> map, String column, double[] samples) {
	
		Map<String, Object> statMap = new HashMap<>();
		
		statMap.put("DescriptiveStats", DescriptiveStats.getAllStats(samples));
		
		map.put(column, statMap);
	}
	
	protected String name;
	protected TobiiExport export;
	protected String[] metrics;
	protected Predicate<String> isValid = (s -> !s.isEmpty());
}
