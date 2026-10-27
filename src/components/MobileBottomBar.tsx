import { RequestButton } from "./RequestModal";
import { FormIcon, PhoneIcon } from "./Icons";

export default function MobileBottomBar({ call, request, phoneHref }: { call: string; request: string; phoneHref: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-3 pt-2.5 backdrop-blur pb-[calc(0.625rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2.5">
        <a href={phoneHref} className="btn-primary h-[52px] gap-1.5 whitespace-nowrap px-2 text-[0.9rem] sm:text-[0.95rem]">
          <PhoneIcon size={18} strokeWidth={2.2} />
          {call}
        </a>
        <RequestButton placement="bottom_bar" className="btn-dark h-[52px] gap-1.5 whitespace-nowrap px-2 text-[0.9rem] sm:text-[0.95rem]">
          <FormIcon size={18} />
          {request}
        </RequestButton>
      </div>
    </div>
  );
}
