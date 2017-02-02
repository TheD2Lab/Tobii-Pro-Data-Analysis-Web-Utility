
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

import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


public class DescriptiveStats {
	
	public static final String MEAN = "mean";
	public static final String MEDIAN = "median";
	public static final String MODE = "mode";
	public static final String VARIANCE = "variance";
	public static final String STD_DEV = "standard deviation";
	public static final String MIN = "min";
	public static final String MAX = "max";
	public static final String SUM = "sum";
	
	public static Map<String, Object> getAllStats(String[] column) {
		
		double[] samples = Arrays.stream(column)
				.mapToDouble(s -> Double.parseDouble(s))
				.sorted()
				.toArray();
		
		return getAllStats(samples);
	}
	
	public static Map<String, Object> getAllStats(double[] samples) {
		return addAllStats(samples, new HashMap<String, Object>());
	}
	
	public static Map<String, Object> addAllStats(double[] samples, Map<String, Object> map) {
		map.put(MEAN, getMean(samples));
		map.put(MEDIAN, getMedian(samples));
		map.put(MODE, getMode(samples));
		map.put(VARIANCE, getVariance(samples));
		map.put(STD_DEV, getStdDev(samples));
		map.put(MIN, getMin(samples));
		map.put(MAX, getMax(samples));
		map.put(SUM, getSum(samples));
		return map;
	}
	
	/*
	 * Basic descriptive statistics.
	 */
	public static double getMin(double[] data)  {
		return Arrays.stream(data)
				.min()
				.getAsDouble();
	}
	
	
	public static double getMax(double[] data)  {
		return Arrays.stream(data)
				.max()
				.getAsDouble();
	}
	
	
	public static double getSum(double[] data) {
		return Arrays.stream(data).sum();
	}
	
	
	/*
	 * Center descriptive statistics.
	 */
	public static double getMean(double[] data) {
		return Arrays.stream(data)
				.average()
				.getAsDouble();
	}
	
	
	public static double getMedian(double[] data) {
		int length = data.length;
		int mid = (int)Math.floor(length / 2.0); 
		if (length % 2 == 0) {
			return (data[mid - 1] + data[mid]) / 2.0;
		}
		else {
			return data[mid];
		}
	}
	
	
	public static double getMode(double[] data) {
		// TODO could be linear if you assume data is sorted.
		HashMap<Double, Integer> frequencyMap = new HashMap<Double, Integer>();
		for (double d : data) {
			Integer count = frequencyMap.get(d);
			if (count == null) {
				frequencyMap.put(d, 1);
			}
			else {
				frequencyMap.put(d, ++count);
			}
		}
		
		double mode = 0.0;
		double maxFrequency = 0.0;
		Iterator<Double> it = frequencyMap.keySet().iterator();
		while (it.hasNext()) {
			double d = it.next();
			int frequency = frequencyMap.get(d);
			if (frequency > maxFrequency) {
				mode = d;
				maxFrequency = frequency;
			}
			else {
				// Keep looking.
			}
		}
		
		return mode;
	}
	

	/*
	 * Dispersion descriptive statistics.
	 */
	public static double getVariance(double[] data) {
		return Math.pow(getSigma(data), 2);
	}
	
	
	public static double getStdDev(double[] data) {
		return getSigma(data);
	}
	
	
	public static double getSigma(double[] data) {
		double mean = getMean(data);
		
		double sum = Arrays.stream(data)
					.map(d -> Math.pow((d - mean), 2))
					.sum();
		
		return Math.sqrt(sum / data.length);
	}

	
} // End class DescriptiveStats
