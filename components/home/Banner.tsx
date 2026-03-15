import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "@/constants/images";

export function Banner() {
  return (
    <section
      className="relative mx-auto h-[257px] w-full max-w-[1200px] overflow-hidden rounded-[20px]"
      aria-label="Tech Revolution Banner"
    >
      <Image
        src={IMAGES.BANNER}
        alt="Tech Revolution Banner"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex h-full  flex-col px-[76px] pt-[22px]">
        <h1 className="text-[45px] leading-[52px] font-normal text-white">
          TECH
          <br />
          <span>REVOLUTION</span>
        </h1>

        <p className="mt-2 text-sm leading-5 font-semibold tracking-[0.01em] text-white">
          Săn ngay loạt deal công nghệ đỉnh cao giảm đến 50%.
        </p>

        <Link
          href="/shop"
          className="mt-10 inline-flex h-[38px] w-fit items-center gap-[6px] rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground shadow-xs transition-opacity hover:opacity-90"
        >
          Mua Sắm Ngay
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
