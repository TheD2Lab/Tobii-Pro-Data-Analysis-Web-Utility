import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import file.TsvUtilities;

public class TobiiExport {

	public static final String GAZE_POINT_X = "GazePointX (ADCSpx)";
	public static final String GAZE_POINT_Y = "GazePointY (ADCSpx)";
	public static final String SACCADE_INDEX = "SaccadeIndex";
	public static final String FIXATION_INDEX = "FixationIndex";
	public static final String GAZE_EVENT_TYPE = "GazeEventType";
	public static final String GAZE_EVENT_DURATION = "GazeEventDuration";
	public static final String VALIDITY_LEFT = "ValidityLeft";
	public static final String VALIDITY_RIGHT = "ValidityRight";
	public static final String ABSOLUTE_SACCADIC_DIRECTION = "AbsoluteSaccadicDirection";
	public static final String RELATIVE_SACCADIC_DIRECTION = "RelativeSaccadicDirection";
	
	public Double getValidity() {
		return validity;
	}
	
	public void setValidity(Double v) {
		validity = v;
	}
	
	// Constructor
	public TobiiExport(File f) {
		this(TsvUtilities.read(f));
	}
	
	
	public TobiiExport(String[][] data) {
		table = data;		
		columnTitleToIndexMap = buildColumnMap(table);
		removeInvalidRecords();
	}
	
	
	private void removeInvalidRecords() {
		
		int originalLength = table.length;
		
		ArrayList<String[]> validRows = new ArrayList<String[]>();
		
		// Add header.
		validRows.add(table[0]);
		
		for (int i = 1; i < table.length; i++) {
			String[] row = table[i];
			if (rowIsValid(row)) {
				validRows.add(row);
			}
			else {
				// Do not add row.
			}
		}
		
		table = validRows.toArray(new String[0][0]);
		
		setValidity((double)table.length / originalLength);
	}
	
	public TobiiExport filtered(String column, String value) {
		
		ArrayList<String[]> filteredRows = new ArrayList<String[]>();
		
		// Add header.
		filteredRows.add(table[0]);
		
		int col = getColumnIndex(column);
		for (int row = 1; row < table.length; row++) {
			String[] currentRow = table[row];
			if (currentRow[col].equals(value)) {
				filteredRows.add(currentRow);
			}
			else {
				// Do nothing.
			}
		}
	 
		return new TobiiExport(filteredRows.toArray(new String[0][0]));
	}
	
	
	public TobiiExport removingDuplicates(String column) {
				
		Map<String, String[]> uniqueMap = new HashMap<String, String[]>();
		
		int col = getColumnIndex(column);
		for (int row = 1; row < table.length; row++) {
			String[] currentRow = table[row];
			String key = currentRow[col];
			if (!uniqueMap.containsKey(key)) {
				uniqueMap.put(key, currentRow);
			}
			else {
				// Do nothing.
			}
			
		}
		
		ArrayList<String[]> uniqueRows = new ArrayList<String[]>();
		
		uniqueRows.add(table[0]);
		
		Iterator<String> it = uniqueMap.keySet().iterator();
		while (it.hasNext()) {
			String key = it.next();
			uniqueRows.add(uniqueMap.get(key));
		}
		
		return new TobiiExport(uniqueRows.toArray(new String[0][0]));
	}
	
	
	private boolean rowIsValid(String[] row) {
		
		int leftCol = columnTitleToIndexMap.get(VALIDITY_LEFT);
		int rightCol = columnTitleToIndexMap.get(VALIDITY_RIGHT);
	
		String left = row[leftCol];
		String right = row[rightCol];
		
		boolean leftIsValid = !left.isEmpty() && Integer.parseInt(left) == 0;
		boolean rightIsValid = !right.isEmpty() && Integer.parseInt(right) == 0;
		
		return leftIsValid && rightIsValid;
	}
	
	
	public int getColumnIndex(String columnTitle) {
		return columnTitleToIndexMap.get(columnTitle);
	}

	
	public String[] getRow(int row) {
		return table[row];
	}
	
	
	public String[] getColumn(String title) {
		return getColumn(columnTitleToIndexMap.get(title));
	}
	
	
	public String[] getColumn(int col) {
		ArrayList<String> columnEntryList = new ArrayList<String>();
		
		for (int row = 1; row < table.length; row++) {
			columnEntryList.add(table[row][col]);
		}
		
		return columnEntryList.toArray(new String[0]);
	}
	
	
	// Gets the number of samples for a dimension
	public int getDimensionCount() {
		return table[0].length;
	}
	
	
	// Gets the number of samples
	public int getSampleCount() {
		return table.length;
	}
	
	
	private static HashMap<String, Integer> buildColumnMap(String[][] table) {
		HashMap<String, Integer> map = new HashMap<String, Integer>();
		for (int col = 0; col < table[0].length; col++) {
			map.put(table[0][col], col);
		}
		return map;
	}
	
	
	private Map<String, Integer> columnTitleToIndexMap;
	private String[][] table;
	private Double validity;
}
