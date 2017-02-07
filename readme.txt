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
 
This analysis tool is compatible with Tobii 2150  eye tracker and the ClearView 2.7.1. 

Inputs: Tobii Recording Data 

Outputs (validated results):

A. Measures of Search:
	
	- fixation count (int)
	- saccade count  (int)
	- saccade length  (px)
	- scanpath length (px)
	- convex hull (px^2)
	
B. Measures of Information Processing:

	- average fixation duration (ms)
	- average saccade duration (ms)
	- saccade-to-fixation duration ratio (float)
	
C. Measures of Cognitive Workload

	- left pupil dilation (mm)
	- right pupil dilation (mm)
	- absolute angle (degrees)
	- relative saccade angles (degrees)

D. Raw data 

	1. Metric Statistics
	
		- right pupil dilation (mm)
		- left pupil dilation (mm)
		- fixation duration (ms)
		- saccade duration (ms)
		- saccade length (px)
		- absolute angle (degrees)
		- relative angle (degrees)

	2. Counts 	
		- saccade count (int)
		- fixation count (int)
	
	3. Dataset Statistics
		- validity (%)
		- duration (s)
		


