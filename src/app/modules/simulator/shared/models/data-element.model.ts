import { ChoiceOption } from './choice-option.model';
import { Diagram } from './diagram.model';
import { ImageProp } from './image-prop.model';
import { ImageOption } from './image-option.model';
import { ExpressionBlock } from './expression-block.model';

export class DataElement {
  public ID: string;
  public Value: string;
  public ElementType: string;
  public IsRequired: boolean;
  public Label: string;
  public Hint: string;
  public Minimum: number;
  public Maximum: number;
  public ChoiceOptions: ChoiceOption[];
  public Diagrams: Diagram[];
  public DisplaySequence: number;
  public Visible: boolean;

  public ImagePath: string;

  public ImageProp: ImageProp;

  public ImageTitle: string;
  public ImageOptions: ImageOption[];

  public ShowValue: boolean;

  public ValueBlocks: ExpressionBlock[];
  public ArithmaticExpression = '';

  public TextExpression: Object[] = [];

  constructor() {
      this.Visible = true;
      this.DisplaySequence = 0;
      this.ValueBlocks = [];
  }

}
