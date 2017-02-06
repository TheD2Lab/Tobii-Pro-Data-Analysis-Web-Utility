
import java.util.Map;
import java.util.function.Predicate;

public class PupilAnalyzer extends Analyzer {
	
	
	public PupilAnalyzer(TobiiExport export) {
		this.export = export;
	}
	
	
	public Map<String, Object> getLeftStats() {
		return getStats(TobiiExport.PUPIL_LEFT, isValid); 
	}
	
	
	public Map<String, Object> getRightStats() {
		return getStats(TobiiExport.PUPIL_RIGHT,isValid); 
	}
	
	
	private static Predicate<String> isValid = (s -> !s.isEmpty() && !s.equals("-1"));
}
