import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;

import file.TsvUtilities;

public class TobiiExport {

	public static final String VALIDITY_LEFT = "ValidityLeft";
	public static final String VALIDITY_RIGHT = "ValidityRight";
	
	public Double getValidity() {
		return validity;
	}
	
	public void setValidity(Double v) {
		validity = v;
	}
	
	// Constructor
	public TobiiExport(File f) {
		table = TsvUtilities.read(f);
		columnMap = buildColumnMap(table);
		validity = null;
	}
	
	// Removes invalid samples
	public TobiiExport filter() {
		
		ArrayList<String[]> filteredRows = new ArrayList<String[]>();
		
		for (int row = 1; row < table.length; row++) {
			String[] currentRow = table[row];
			if (rowIsValid(currentRow)) {
				filteredRows.add(currentRow);
			}
			else {
				// Do nothing.
			}
		}
		
		// Reset the export object's data.
		table = filteredRows.toArray(new String[0][0]);
		
		// Return the export object which has new composing data. 
		return this;
	}
	
	private boolean rowIsValid(String[] row) {
		
		// TODO this only needs to be assigned once, in constructor.
		int leftCol = columnMap.get(VALIDITY_LEFT);
		int rightCol = columnMap.get(VALIDITY_RIGHT);
	
		String left = row[leftCol];
		String right = row[rightCol];
		
		boolean leftIsValid = !left.isEmpty() && Integer.parseInt(left) == 0;
		boolean rightIsValid = !right.isEmpty() && Integer.parseInt(right) == 0;
		
		return leftIsValid && rightIsValid;
	}
	
	// Gets all samples for a particular dimension
	public String[] getColumn(String columnTitle) {
		
		ArrayList<String> columnEntryList = new ArrayList<String>();
		
		int col = columnMap.get(columnTitle);
		
		for (int row = 0; row < table.length; row++) {
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
	
	
	private HashMap<String, Integer> columnMap;
	private String[][] table;
	private Double validity;
}
