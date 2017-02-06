
import java.util.Arrays;
import java.util.Map;
import java.util.function.Predicate;

public class Analyzer {

	public void addAllStats(Map<String, Object> map) {
		for (String metric : metrics) {
			addStats(map, metric, isValid);
		}
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
		map.put(column, DescriptiveStats.getAllStats(samples));
	}
	
	protected TobiiExport export;
	protected String[] metrics;
	protected Predicate<String> isValid = (s -> !s.isEmpty());
}
