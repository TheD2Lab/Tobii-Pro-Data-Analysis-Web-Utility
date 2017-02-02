
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

import java.util.List;
import java.util.Map;


public class SaccadeProcessor {
	
	public static final String SACCADE = "Saccade";
	
	
	public SaccadeProcessor(TobiiExport export) {
		this.export = export.filtered(TobiiExport.GAZE_EVENT_TYPE, SACCADE)
				.removingDuplicates(TobiiExport.SACCADE_INDEX);
		
		TobiiExport fixationSamples = export.filtered(TobiiExport.GAZE_EVENT_TYPE, FixationProcessor.FIXATION)
				.removingDuplicates(TobiiExport.FIXATION_INDEX);
		
		fixationPoints = FixationProcessor.buildPointList(fixationSamples);
	}
	
	
	public int getCount() {
		return export.getSampleCount();
	}
	
	
	public Map<String, Object> getDurationStats() {
		String[] durations = export.getColumn(TobiiExport.GAZE_EVENT_DURATION);
		return DescriptiveStats.getAllStats(durations);
	}

	
	public Map<String, Object> getLengthStats() {
		double[] lengths = getSaccadeLengths(fixationPoints);
		return DescriptiveStats.getAllStats(lengths);
	}
	
	
	public static double[] getSaccadeLengths(List<Point> fixationPoints) {
		
		int fixationCount = fixationPoints.size();
		
		double[] lengths = new double[fixationCount];
		
		Point earlierFixation = fixationPoints.get(0);
		for (int i = 1; i < fixationCount; i++) {
			
			Point laterFixation = fixationPoints.get(i);
			
			double length = laterFixation.distance(earlierFixation); 
			lengths[i - 1] = length;
			
			earlierFixation = laterFixation;
		}
		
		return lengths;
	}
	
	
	private TobiiExport export;
	
	private List<Point> fixationPoints;
}
