
/*
 * Copyright (c) 2013, Bo Fu 
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import java.awt.Point;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class SaccadeAnalyzer extends Analyzer {
	
	/*
	 * Public Class Constants.
	 */
	public static final String NAME = "Saccade";
	
	
	/*
	 * Constructors.
	 */
	
	public SaccadeAnalyzer(TobiiExport export) {
		
		super(parseExport(export), NAME);
		
		TobiiExport fixationSamples = export.filtered(TobiiExport.GAZE_EVENT_TYPE, FixationAnalyzer.NAME)
				.removingDuplicates(TobiiExport.FIXATION_INDEX);
		
		fixationPointSamples = FixationAnalyzer.buildPointList(fixationSamples);
	}
	
	private static TobiiExport parseExport(TobiiExport export) {
		return export.filtered(TobiiExport.GAZE_EVENT_TYPE, NAME)
				.removingDuplicates(TobiiExport.SACCADE_INDEX);
	}
	
	/*
	 * Statistics Methods.
	 */
	
	
	@Override
	public void analyze() {
		
		addCountStats(data);
		
		addDurationStats(data);
		
		addLengthStats(data);
	}
	
	public void addDurationStats(Map<String, Object> map) {
		String durationMetric =  "SaccadeDuration";
		addStats(map, TobiiExport.GAZE_EVENT_DURATION, durationMetric);
		putAllSamples(map, TobiiExport.GAZE_EVENT_DURATION, durationMetric);
	}

	
	public void addLengthStats(Map<String, Object> map) {
		
		List<Sample<Double>> lengthSamples = getLengthSamples(fixationPointSamples);
		
		double[] lengths = extractSampleValues(lengthSamples)
				.stream()
				.mapToDouble(Double::doubleValue)
				.toArray();
		
		addStats(map, "SaccadeLength", lengths);
		
		putAllLengthSamples(map, lengthSamples);
	}
	
	
	@SuppressWarnings("unchecked")
	private void putAllLengthSamples(Map<String, Object> map, List<Sample<Double>> samples) {
		
		Map<String, Object> sampleMap = new HashMap<>();
		
		for (int i = 0; i < samples.size(); i++) {
			Sample<Double> s = samples.get(i);
			sampleMap.put(Long.toString(s.getTime()), Double.toString(s.getValue()));
		}
		
		Map<String, Object> metricMap = (Map<String, Object>) map.get("SaccadeLength");
		metricMap.put("Samples", sampleMap);
	}
	
	
	private static List<Sample<Double>> getLengthSamples(List<Sample<Point>> pointSamples) {
		
		List<Sample<Double>> samples = new ArrayList<Sample<Double>>();
		
		int fixationCount = pointSamples.size();
		
		Sample<Point> earlierFixation = pointSamples.get(0);
		for (int i = 1; i < fixationCount; i++) {
			
			Sample<Point> laterFixation = pointSamples.get(i);
			
			double length = laterFixation.getValue().distance(earlierFixation.getValue()); 
			samples.add(new Sample<Double>(earlierFixation.getTime(), length));
			
			earlierFixation = laterFixation;
		}
		
		return samples;
	}
	
	
	/*
	 * Private Member Variables.
	 */
	
	private List<Sample<Point>> fixationPointSamples;
}
