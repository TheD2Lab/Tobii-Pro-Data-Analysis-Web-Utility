
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
import java.util.Map;


public class Saccade {
	
	public static final String SACCADE = "Saccade";
	
	
	public Saccade(TobiiExport export) {
		this.export = export.filtered(TobiiExport.GAZE_EVENT_TYPE, SACCADE)
				.removingDuplicates(TobiiExport.SACCADE_INDEX);
	}
	
	
	public int getCount() {
		return export.getSampleCount();
	}
	
	public Map<String, Double> getDurationStats() {
		String[] durations = export.getColumn(TobiiExport.GAZE_EVENT_DURATION);
		return DescriptiveStats.getAllStats(durations);
	}

	public static double[] getSaccadeLengths(ArrayList<Point> fixationPoints) {
		
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
	
	//the saccade duration is the duration between two fixations
	//e.g. given a fixation A that has timestamp T1 and duration D1,
	//and a subsequent fixation B that has timestamp T2 and duration T2,
	//the saccade duration between A and B is: T2-(T1+D1)
	public static ArrayList<Integer> getAllSaccadeDurations(ArrayList<Object> saccadeDetails){
		ArrayList<Integer> allSaccadeDurations = new ArrayList<Integer>();
		for (int i=0; (i+1)<saccadeDetails.size(); i++){
			Integer[] currentDetail = (Integer[]) saccadeDetails.get(i);
			Integer[] subsequentDetail = (Integer[]) saccadeDetails.get(i+1);
			
			int currentTimestamp = currentDetail[0];
			int currentFixationDuration = currentDetail[1];
			int subsequentTimestamp = subsequentDetail[0];
			
			int eachSaccadeDuration = subsequentTimestamp - (currentTimestamp + currentFixationDuration);
			
			allSaccadeDurations.add(eachSaccadeDuration);
		}
		return allSaccadeDurations;
	}
	
	
	private TobiiExport export;
}
