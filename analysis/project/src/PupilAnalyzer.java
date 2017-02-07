
import java.util.function.Predicate;

public class PupilAnalyzer extends Analyzer {
	
	public static final String NAME = "Pupil";
	
	public static final String[] METRICS = {
		TobiiExport.PUPIL_LEFT,
		TobiiExport.PUPIL_RIGHT
	};
	
	
	public PupilAnalyzer(TobiiExport export) {
		super(export, NAME);
		this.metrics = METRICS;
		this.isValid = IS_VALID;
	}
	
	private static final Predicate<String> IS_VALID = (s -> !s.isEmpty() && !s.equals("-1"));
}
