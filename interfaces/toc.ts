interface TocObject {
  bgColor: string;
  color: string;
  group: string;
  id: number;
  title: string;
}

type Toc = Array<TocObject>;

export default Toc;
