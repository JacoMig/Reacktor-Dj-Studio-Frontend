import {mapFrom01Linear} from '@dsp-ts/math';

type KnobBaseThumbProps = {
  //readonly theme: 'stone' | 'pink' | 'green' | 'sky';
  readonly value01: number;
};

export function KnobBaseThumb({ value01}: KnobBaseThumbProps) {
  const angleMin = -145;
  const angleMax = 145;
  const angle = mapFrom01Linear(value01, angleMin, angleMax);
  return (
    <div
      className={"KnobBaseThumb"}
    >
      <div  style={{rotate: `${angle}deg`}}>
        <div />
      </div>
    </div>
  );
}