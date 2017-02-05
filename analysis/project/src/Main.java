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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.json.JsonObject;

import file.JsonUtilities;
import measure.TimeUtilities;


public class Main {
	
	public static final int INPUT_PATH_INDEX = 0;
	public static final int OUTPUT_PATH_INDEX = 1;
	
	public static final String SEARCH = "Search";
	public static final String INFO_PROC = "Information Processing";
	public static final String COG_WORK = "Cognitive Workload";
	public static final String RAW = "Raw Data";
	
	public static final String PUPIL_METRICS = "Pupil";
	public static final String FIXATION_METRICS = "Fixation";
	public static final String SACCADE_METRICS = "Saccade";
	public static final String ANGLE_METRICS = "Angle";
	
	
	public static void main(String args[]) throws IOException{
		
		long start = TimeUtilities.getCurrentTime();
		
		File f = new File(args[INPUT_PATH_INDEX]);
		TobiiExport export = new TobiiExport(f);
		
		Map<String, Map<String, Double>> rawMap = getRawData(export);
		
		Node<String> rawTree = new Node<String>("rawData");
		rawTree.addChildren(getRawData(export));
		
		outputMap.put(RAW, getAllRawData(exportData));
        
		outputMap.put(PUPIL_METRICS, getPupilMetrics(exportData));
		outputMap.put(FIXATION_METRICS, getFixationMetrics(exportData));
		outputMap.put(SACCADE_METRICS, getSaccadeMetrics(exportData));
		outputMap.put(ANGLE_METRICS, getAngleMetrics(exportData));
		
		JsonObject json = JsonUtilities.getObject(outputMap);
		JsonUtilities.write(json, args[OUTPUT_PATH_INDEX]);
		
		long stop = TimeUtilities.getCurrentTime();
		System.out.printf("Analysis runtime duration: %s\n", TimeUtilities.parseDuration(stop - start));
	}
	
	
	public static List<Node<String>> getRawData(TobiiExport export) {
		
		List<Node<String>> metrics = new ArrayList<Node<String>>();
		
		addPupilMetrics(metrics, export);
		addFixationMetrics(rawMap, export);
		
		
		
		
		return rawMap;
	}
	
	
	public static void addPupilMetrics(List<Node<String>> metrics , TobiiExport export) {
		
		PupilProcessor pProc = new PupilProcessor(export);
		
		pProc.addRightStats(metrics);
		pProc.addLeftStats(metrics);
	}
	
	
	public static Map<String, Object> addixationMetrics(Map<String, Map<String, Double>> map, TobiiExport export) {
		
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
