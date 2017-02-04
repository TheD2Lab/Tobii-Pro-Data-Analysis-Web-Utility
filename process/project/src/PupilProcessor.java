import java.util.Arrays;
import java.util.Map;

public class PupilProcessor {
	
	public static final int LEFT = 0;
	public static final int RIGHT = 1;
	
	public PupilProcessor(TobiiExport export) {
		
		this.export = export;
		
		pupilLeftSamples = getPupilSamples(TobiiExport.PUPIL_LEFT);
		
		pupilRightSamples = getPupilSamples(TobiiExport.PUPIL_RIGHT);
	}
	
	
	public Map<String, Object> getDescriptiveStats(int metric) {
		
		double[] samples = null;
		
		switch (metric) {
			case LEFT:
				samples = pupilLeftSamples;
				break;
			case RIGHT: 
				samples = pupilRightSamples;
				break;
			default: 
				throw new RuntimeException("Unkown metric number: " + metric);
		}
		
		return DescriptiveStats.getAllStats(samples);
	}
	
	
	private double[] getPupilSamples(String column) {
		return Arrays.stream(this.export.getColumn(column))
				.mapToDouble(Double::parseDouble)
				.filter(p -> p != -1.0)
				.toArray();
	}
	
	
	private TobiiExport export;
	private double[] pupilLeftSamples;
	private double[] pupilRightSamples;
}
