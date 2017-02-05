import java.util.List;
import java.util.function.Predicate;

public class PupilAnalyzer extends Analyzer {
	
	
	public PupilAnalyzer(TobiiExport export) {
		this.export = export;
	}
	
	
	public void addLeftStats(List<Node<String>> list) {
		addStats(TobiiExport.PUPIL_LEFT, list, isValid); 
	}
	
	
	public void addRightStats(List<Node<String>> list) {
		addStats(TobiiExport.PUPIL_LEFT, list ,isValid); 
	}
	
	
	private static Predicate<String> isValid = (s -> !s.isEmpty() && !s.equals("-1"));
}
