import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import measure.TimeUtilities;

public class MetaAnalyzer extends Analyzer {

	public static final String NAME = "Meta";
	
	public MetaAnalyzer(TobiiExport export) {
		super(export, NAME);
	}
	
	@Override
	public void run() {
		putMetadata(data);
	}
	
	public void putMetadata(Map<String, Object> map) {
		
		Map<String, Object> metaMap = new HashMap<>();
		
		metaMap.put("Validity", export.getValidity());
		metaMap.put("Duration", getRecordingDuration(export));
		
		map.put(NAME, metaMap);
	}
	
	public static String getRecordingDuration(TobiiExport export) {

		String[] samples = export.getColumn(TobiiExport.EYE_TRACKER_TIMESTAMP);
		
		long[] times = Arrays.stream(samples)
				.mapToLong(Long::parseLong)
				.toArray();
		
		long duration = times[times.length - 1] - times[0];
		
		return TimeUtilities.formatMicroseconds(duration);
	}
	
}
