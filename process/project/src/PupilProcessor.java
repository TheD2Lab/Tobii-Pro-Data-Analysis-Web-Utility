import java.util.Arrays;
import java.util.Map;

public class PupilProcessor {
	
	private enum PupilMetric { LEFT, RIGHT };
	
	public PupilProcessor(TobiiExport export) {
		
		this.export = export;
		
		pupilLeftSamples = getPupilSamples(TobiiExport.PUPIL_LEFT);
		
		pupilRightSamples = getPupilSamples(TobiiExport.PUPIL_RIGHT);
	}
	
	
	public Map<String, Object> getMetric(PupilMetric metric) {
		
		double[] samples = null;
		
		switch (metric) {
			case LEFT: samples = pupilLeftSamples;
			case RIGHT: samples = pupilRightSamples;
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
