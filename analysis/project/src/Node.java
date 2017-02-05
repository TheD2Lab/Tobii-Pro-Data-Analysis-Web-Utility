import java.util.ArrayList;
import java.util.List;

public class Node<T> {

	public Node(T data) {
		this.data = data;
	}
	
	public Node<T> addChild(Node<T> c) {
		children.add(c);
		return this;
	}
	
	public Node<T> addChildren(List<Node<T>> cs) {
		children.addAll(cs);
		return this;
	}
	
	public List<Node<T>> getChildren() {
		return children;
	}
	
	public void dropChildren() {
		children = null;
	}
	
	public void setData(T d) {
		data = d;
	}
	
	public T getData() {
		return data;
	}
	
	
	private T data;
	private ArrayList<Node<T>> children;
	
}
