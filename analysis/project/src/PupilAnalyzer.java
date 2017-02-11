
import java.util.HashMap;
import java.util.Map;
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
	
	@SuppressWarnings("unchecked")
	@Override
	public void putAllSamples(Map<String, Object> map, String column) {
		
		String[] timestamps = export.getColumn(TobiiExport.EYE_TRACKER_TIMESTAMP);
		String[] samples = export.getColumn(column);
		
		Map<String, Object> sampleMap = new HashMap<>();
		
		for (int i = 0; i < timestamps.length; i++) {
			if (Double.parseDouble(samples[i]) == INVALID_PUPIL_MEASURE) { 
				// Do not add invalid recordings.
			}
			else {
				sampleMap.put(timestamps[i], samples[i]);
			}
		}
		
		Map<String, Object> metricMap = (Map<String, Object>) map.get(column);
		metricMap.put("Samples", sampleMap);
	}
	
	private static final Double INVALID_PUPIL_MEASURE = -1.0;
	
	private static final Predicate<String> IS_VALID = (s -> !s.isEmpty() && !s.equals("-1.00"));
}
