
import {useId} from 'react';
import {
  KnobHeadless,
  KnobHeadlessLabel,
  KnobHeadlessOutput,
  useKnobKeyboardControls,
} from 'react-knob-headless';
import {mapFrom01Linear, mapTo01Linear} from '@dsp-ts/math';
import {KnobBaseThumb} from './KnobBaseThumb';
import "./KnobBase.css"
import { Flex } from '@radix-ui/themes';

type KnobHeadlessProps = React.ComponentProps<typeof KnobHeadless>;

type KnobBaseProps = Pick<
  KnobHeadlessProps,
  | 'valueMin'
  | 'valueMax'
  | 'orientation'
  | 'mapTo01'
  | 'mapFrom01'
  | 'onValueRawChange'
  | 'valueRaw'
> & {
  valueRawDisplayFn?: KnobHeadlessProps['valueRawDisplayFn'];
} &
  {
    readonly label: string;
    readonly valueDefault: number;
    readonly stepFn?: (valueRaw: number) => number;
    readonly stepLargerFn?: (valueRaw: number) => number;
  };

export function KnobBase({
  label,
  valueRaw,
  valueMin,
  valueMax,
  orientation,
  stepFn =  (v:number) => v,
  stepLargerFn = (v:number) => v,
  valueRawDisplayFn =  (v:number) => `${v.toFixed(0)}`,
  mapTo01 = mapTo01Linear,
  mapFrom01 = mapFrom01Linear,
  onValueRawChange
}: KnobBaseProps) {
  const knobId = useId();
  const labelId = useId();
 // const [valueRaw, setValueRaw] = useState<number>(valueDefault);
  const value01 = mapTo01(valueRaw, valueMin, valueMax);
  const step = stepFn(valueRaw);
  const stepLarger = stepLargerFn(valueRaw);
  const dragSensitivity = 0.006;

 //const valueRawDisplayFn = (v:number) => `${v.toFixed(0)}`

  const keyboardControlHandlers = useKnobKeyboardControls({
    valueRaw,
    valueMin,
    valueMax,
    step,
    stepLarger,
    onValueRawChange,
  });

  return (
    <Flex
      className={"KnobBase"}
      direction={"column"}
      align={"center"}
    >
      <KnobHeadlessLabel id={labelId}>{label}</KnobHeadlessLabel>
      <KnobHeadless
        id={knobId}
        aria-labelledby={labelId}
        valueMin={valueMin}
        valueMax={valueMax}
        valueRaw={valueRaw}
        valueRawRoundFn={(v:number) => Number(v.toFixed(0))}
        valueRawDisplayFn={valueRawDisplayFn}
        dragSensitivity={dragSensitivity}
        orientation={orientation}
        mapTo01={mapTo01}
        mapFrom01={mapFrom01}
        onValueRawChange={onValueRawChange}
        {...keyboardControlHandlers}
      >
        <KnobBaseThumb value01={value01} />
      </KnobHeadless>
      <KnobHeadlessOutput htmlFor={knobId}>
        {valueRawDisplayFn(valueRaw)}
      </KnobHeadlessOutput>
    </Flex>
  );
}