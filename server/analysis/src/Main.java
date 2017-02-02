/*
 * Copyright (c) 2017, Bo Fu, HDSC Lab 
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

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


public class Main {
	
	public static final String PUPIL_METRICS = "Pupil";
	public static final String FIXATION_METRICS = "Fixation";
	public static final String SACCADE_METRICS = "Saccade";
	public static final String ANGLE_METRICS = "Angle";
	
	
	public static void main(String args[]) throws IOException{
		
		File f = new File(args[0]);
		TobiiExport exportData = new TobiiExport(f);
		
		HashMap<String, Object> outputMap = new HashMap<String, Object>();
        
		outputMap.put(PUPIL_METRICS, getPupilMetrics(exportData));
		outputMap.put(FIXATION_METRICS, getFixationMetrics(exportData));
		outputMap.put(SACCADE_METRICS, getSaccadeMetrics(exportData));
		outputMap.put(ANGLE_METRICS, getSaccadeMetrics(exportData));
	}
	
	
	public static Map<String, Object> getPupilMetrics(TobiiExport export) {
		
		String[] pupilMeasures = { "PupilLeft", "PupilRight", "PupilBoth" };
		
		Map<String, Object> map = new HashMap<String, Object>();
		for (String measure : pupilMeasures) {
			String[] samples = export.getColumn(measure); 
			map.put(measure, DescriptiveStats.getAllStats(samples));
		}
		
		return map;
	}
	
	
	public static Map<String, Object> getFixationMetrics(TobiiExport export) {
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		FixationProcessor fProc = new FixationProcessor(export);
		
		map.put("Count", fProc.getCount());
		map.put("Duration", fProc.getDurationStats());
		map.put("ConvexHullArea", fProc.getConvexHullArea());
		map.put("ConvexHull", fProc.getMappedConvexHull());
		
		return map;
	}
	
	
	public static Map<String, Object> getSaccadeMetrics(TobiiExport export) {
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		SaccadeProcessor sProc = new SaccadeProcessor(export);
		map.put("Count", sProc.getCount());
		map.put("Duration", sProc.getDurationStats());
		map.put("Length", sProc.getLengthStats());
		
		return map;
	}
	
	public static Map<String, Object> getAngleMetrics(TobiiExport export) {
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		AngleProcessor aProc = new AngleProcessor(export);
		map.put("RelativeAngle", aProc.getRelativeAngleStats());
		map.put("AbsoluteAngle", aProc.getAbsoluteAngleStats());
		
		return map;
	}

}
