import { cloneElement, ReactElement, useState } from 'react';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
  FloatingPortal,
} from '@floating-ui/react-dom-interactions';

interface IProps {
  className?: string;
  render: (data: { close: () => void; labelId: string; descriptionId: string }) => React.ReactNode;
  placement?: Placement;
  children: JSX.Element;
}

// ref: https://codesandbox.io/s/quizzical-water-b3dedw?file=/src/Popover.tsx:1416-1423
function PopoverPortal(props: IProps): ReactElement {
  const { children, render, placement, className = '' } = props;
  const [open, setOpen] = useState(false);

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(10), flip(), shift({ padding: 10 })],
    placement,
    whileElementsMounted: autoUpdate,
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context),
  ]);

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref: reference, ...children.props }))}
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} order={['reference', 'content']} returnFocus={false}>
            <div
              {...getFloatingProps({
                className,
                ref: floating,
                style: { position: strategy, top: y ?? 70, left: x ?? 0 },
                'aria-labelledby': labelId,
                'aria-describedby': descriptionId,
              })}
            >
              {render({ labelId, descriptionId, close: () => setOpen(false) })}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}

export default PopoverPortal;
