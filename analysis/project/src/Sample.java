
public class Sample<T> {

	public Sample(long t, T v) {
		setTime(t);
		setValue(v);
	}
	
	public long getTime() {
		return time;
	}
	
	public T getValue() {
		return value;
	}
	
	public void setTime(long t) {
		time = t;
	}
	
	public void setValue(T v) {
		value = v;
	}
	
	
	private long time;
	private T value;
}
