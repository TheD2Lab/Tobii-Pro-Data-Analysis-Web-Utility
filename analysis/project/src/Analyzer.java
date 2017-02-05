import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

public class Analyzer {

	
	public void addStats(String column, List<Node<String>> list) {
		 addStats(column, list, (s -> !s.isEmpty()));
	}
	
	
	public void addStats(String column, List<Node<String>> list, Predicate<String> isValid) {
		
		double[] metrics = Arrays.stream(this.export.getColumn(column))
				.filter(isValid)
				.mapToDouble(Double::parseDouble)
				.toArray();
		
		addStats(column, list, metrics);
	}
	
	public void addStats(String column, List<Node<String>> list, double[] metrics) {
		Map<String, Double> statMap = DescriptiveStats.getAllStats(metrics);
		
		Node<String> parent = new Node<String>(column);
		parent.addChildren(transformStatisticsMappings(statMap));
		list.add(parent);
	}
	
	protected List<Node<String>> transformStatisticsMappings(Map<String, Double> statMap) {
		List<Node<String>> statList = new ArrayList<Node<String>>();
		
		Iterator<String> it = statMap.keySet().iterator();
		while (it.hasNext()) {
			
			String k = it.next();
			String v = Double.toString(statMap.get(k));
			
			Node<String> p = new Node<String>(k);
			Node<String> c = new Node<String>(v);
			
			p.addChild(c);
			statList.add(p);
		}
		
		return statList;
	}
	
	protected TobiiExport export;
}
