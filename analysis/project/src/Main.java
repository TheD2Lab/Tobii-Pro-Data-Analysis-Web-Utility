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

import java.awt.Point;
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
		
		Map<String, Object> rawMap = getRawData(export);

		Map<String, Object> outputMap = new HashMap<>();
		outputMap.put("Search", getMeasuresOfSearch(rawMap));
		outputMap.put("Process", getMeasuresOfProcessing(rawMap));
		outputMap.put("Cognition", getMeasuresOfCognition(rawMap));
		outputMap.put("Raw", rawMap);
		
		JsonUtilities.write(outputMap, args[OUTPUT_PATH_INDEX]);
		
		long stop = TimeUtilities.getCurrentTime();
		System.out.printf("Analysis runtime duration: %s\n", TimeUtilities.parseDuration(stop - start));
	}
	
	public static Map<String, Object> getMeasuresOfSearch(Map<String, Object> map) {
		return null;
	}
	
	public static Map<String, Object> getMeasuresOfProcessing(Map<String, Object> map) {
		return null;
	}

	public static Map<String, Object> getMeasuresOfCognition(Map<String, Object> map) {
		return null;
	}
	
	public static Map<String, Object> getRawData(TobiiExport export) {
		
		Map<String, Object> rawMap = new HashMap<>();
		
		addPupilMetrics(rawMap, export);
		addFixationMetrics(rawMap, export);
		addSaccadeMetrics(rawMap, export);
		addAngleMetrics(rawMap, export);
		
		return rawMap;
	}
	
	
	public static void addPupilMetrics(Map<String, Object> map, TobiiExport export) {
		
		Map<String, Object> pupMap = new HashMap<>();
		
		PupilAnalyzer pupLyz = new PupilAnalyzer(export);
		
		pupMap.put("PupilRight", pupLyz.getRightStats());
		pupMap.put("PupilLeft", pupLyz.getLeftStats());
		
		map.put("Pupil", pupMap);
	}
	
	
	public static void addFixationMetrics(Map<String, Object> map, TobiiExport export) {
		
		Map<String, Object> fixMap = new HashMap<>();
		
		FixationAnalyzer fixLyz = new FixationAnalyzer(export);
		
		List<Point> convexHull = fixLyz.getConvexHull();
		
		fixMap.put("Count", fixLyz.getCount());
		fixMap.put("Duration", fixLyz.getDurationStats());
		fixMap.put("ConvexHull", fixLyz.transformPoints(convexHull));
		fixMap.put("ConvexHullArea", fixLyz.getPolygonArea(convexHull));
		
		map.put("Fixation", fixMap);
	}
	
	
	public static void addSaccadeMetrics(Map<String, Object> map, TobiiExport export) {
		
		Map<String, Object> saccMap = new HashMap<>();
		
		SaccadeAnalyzer saccLyz = new SaccadeAnalyzer(export);
		
		saccMap.put("Count", saccLyz.getCount());
		saccMap.put("Duration", saccLyz.getDurationStats());
		saccMap.put("Length", saccLyz.getLengthStats());
		
		map.put("Saccade", saccMap);
	}
	
	public static void addAngleMetrics(Map<String, Object> map, TobiiExport export) {
		
		Map<String, Object> angMap = new HashMap<String, Object>();
		
		AngleAnalyzer angLyz = new AngleAnalyzer(export);
		
		angMap.put("RelativeAngle", angLyz.getRelativeAngleStats());
		angMap.put("AbsoluteAngle", angLyz.getAbsoluteAngleStats());
		
		map.put("Angle", angMap);
	}

}
