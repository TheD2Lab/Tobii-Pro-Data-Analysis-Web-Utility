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

import java.io.File;
import java.io.IOException;
import java.util.HashMap;


public class Main {
	
	public static final String PUPIL_METRICS = "pupil";
	
	
	public static void main(String args[]) throws IOException{
		
		File f = new File(args[0]);
		TobiiExport exportData = new TobiiExport(f);
		
		HashMap<String, Object> outputMap = new HashMap<String, Object>();
        
		outputMap.put(PUPIL_METRICS, getPupilMetrics(exportData));
	}
	
	
	public static HashMap<String, Object> getPupilMetrics(TobiiExport te) {
		
		String[] pupilMeasures = { "PupilLeft", "PupilRight", "PupilBoth" };
		
		HashMap<String, Object> map = new HashMap<String, Object>();
		for (String measure : pupilMeasures) {
			String[] samples = te.getColumn(measure);
			map.put(measure, DescriptiveStats.getAllStats(samples));
		}
		
		return map;
	}

}
