
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


public class FixationAnalyzer extends Analyzer {
	
	/*
	 * Public Constants.
	 */
	
	
	public static final String FIXATION = "Fixation";
	
	
	/*
	 * Method Definitions.
	 */
	
	
	public FixationAnalyzer(TobiiExport export) {
		this.export = export.filtered(TobiiExport.GAZE_EVENT_TYPE, FIXATION)
				.removingDuplicates(TobiiExport.FIXATION_INDEX);
		 
		points = buildPointList(export);
	}
	
	
	public int getCount() {
		return export.getSampleCount();
	}
	
	
	public List<Point> getPoints() {
		return points;
	}
	
	
	public void DurationStats(List<Node<String>> list) {
		addStats(TobiiExport.GAZE_EVENT_DURATION, list);
	}
	
	
	public List<Point> getConvexHull() {
		return ConvexHull.getConvexHull(points);
	}
	
	
	public Double getConvexHullArea() {
		return ConvexHull.getPolygonArea(getConvexHull().toArray(new Point[0]));
	}
	
	
	public List<Map<String, Object>> getMappedConvexHull() {
		
		List<Map<String, Object>> pointList = new ArrayList<Map<String, Object>>();
		
		List<Point> convexHull = getConvexHull();
		for (int i = 0; i < convexHull.size(); i++) {
			Map<String, Object> m = new HashMap<String, Object>();
			
			Point p = convexHull.get(i);
			m.put("x", p.getX());
			m.put("y", p.getY());
			
			pointList.add(m);
		}
		
		return pointList;
	}
	
	
	public static ArrayList<Point> buildPointList(TobiiExport export) {
		
		ArrayList<Point> points = new ArrayList<Point>();
		
		int xCol = export.getColumnIndex(TobiiExport.GAZE_POINT_X);
		int yCol = export.getColumnIndex(TobiiExport.GAZE_POINT_Y);
		
		for (int i = 1; i < export.getSampleCount(); i++) {
			points.add(makePoint(export.getRow(i), xCol, yCol));
		}
		
		return points;
	}
	
	
	private static Point makePoint(String[] record, int xCol, int yCol) {
		int x = Integer.parseInt(record[xCol]);
		int y = Integer.parseInt(record[yCol]);
		return new Point(x, y);
	}

	
	/*
	 * Private Member Variables.
	 */
	
	private ArrayList<Point> points;
	
}