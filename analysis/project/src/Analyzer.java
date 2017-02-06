
import java.util.Arrays;
import java.util.Map;
import java.util.function.Predicate;

public class Analyzer {

	
	public Map<String, Object> getStats(String column) {
		 return getStats(column, (s -> !s.isEmpty()));
	}
	
	
	public Map<String, Object> getStats(String column, Predicate<String> isValid) {
		
		double[] metrics = Arrays.stream(this.export.getColumn(column))
				.filter(isValid)
				.mapToDouble(Double::parseDouble)
				.toArray();
		
		return getStats(column,metrics);
	}
	
	public Map<String, Object> getStats(String column, double[] metrics) {
		return DescriptiveStats.getAllStats(metrics);
	}
	
	protected TobiiExport export;
}
