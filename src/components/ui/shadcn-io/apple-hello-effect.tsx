"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const initialProps = {
  pathLength: 0,
  opacity: 0,
} as const;

const animateProps = {
  pathLength: 1,
  opacity: 1,
} as const;

type Props = React.ComponentProps<typeof motion.svg> & {
  speed?: number;
  onAnimationComplete?: () => void;
};

function AppleHelloChiaMaEffect({
  className,
  speed = 1,
  onAnimationComplete,
  ...props
}: Props) {
  const calc = (x: number) => x * speed;
  
  return (
    <motion.svg
      className={cn("h-20", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="14.8883"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      <title>ChiaMa.io</title>
      
      {/* C */}
      <motion.path
        d="M50 50C50 30 70 10 100 10C130 10 150 30 150 50C150 70 130 90 100 90C70 90 50 70 50 50"
        style={{ strokeLinecap: "round" }}
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.8),
          ease: "easeInOut",
          opacity: { duration: 0.4 },
        }}
      />
      
      {/* h */}
      <motion.path
        d="M170 90V10M170 50C170 30 190 10 220 10C250 10 270 30 270 50V90"
        style={{ strokeLinecap: "round" }}
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.8),
          ease: "easeInOut",
          delay: calc(0.8),
          opacity: { duration: 0.4, delay: calc(0.8) },
        }}
      />
      
      {/* i */}
      <motion.path
        d="M290 90V50M290 20C290 15 295 10 300 10C305 10 310 15 310 20"
        style={{ strokeLinecap: "round" }}
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.4),
          ease: "easeInOut",
          delay: calc(1.6),
          opacity: { duration: 0.2, delay: calc(1.6) },
        }}
      />
      
      {/* a */}
      <motion.path
        d="M330 90C330 70 350 50 380 50C410 50 430 70 430 90C430 110 410 130 380 130C350 130 330 110 330 90M330 70C330 50 350 30 380 30C410 30 430 50 430 70"
        style={{ strokeLinecap: "round" }}
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(1.0),
          ease: "easeInOut",
          delay: calc(2.0),
          opacity: { duration: 0.5, delay: calc(2.0) },
        }}
      />
      
      {/* M */}
      <motion.path
        d="M450 90V10M450 10L480 50L510 10L540 50L570 10V90"
        style={{ strokeLinecap: "round" }}
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(1.2),
          ease: "easeInOut",
          delay: calc(3.0),
          opacity: { duration: 0.6, delay: calc(3.0) },
        }}
      />
      
      {/* a */}
      <motion.path
        d="M590 90C590 70 610 50 640 50C670 50 690 70 690 90C690 110 670 130 640 130C610 130 590 110 590 90M590 70C590 50 610 30 640 30C670 30 690 50 690 70"
        style={{ strokeLinecap: "round" }}
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(1.0),
          ease: "easeInOut",
          delay: calc(4.2),
          opacity: { duration: 0.5, delay: calc(4.2) },
        }}
      />
      
      {/* . */}
      <motion.path
        d="M710 90C710 85 715 80 720 80C725 80 730 85 730 90C730 95 725 100 720 100C715 100 710 95 710 90"
        style={{ strokeLinecap: "round" }}
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.3),
          ease: "easeInOut",
          delay: calc(5.2),
          opacity: { duration: 0.15, delay: calc(5.2) },
        }}
      />
      
      {/* i */}
      <motion.path
        d="M750 90V50M750 20C750 15 755 10 760 10C765 10 770 15 770 20"
        style={{ strokeLinecap: "round" }}
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.4),
          ease: "easeInOut",
          delay: calc(5.5),
          opacity: { duration: 0.2, delay: calc(5.5) },
        }}
      />
      
      {/* o */}
      <motion.path
        d="M790 90C790 70 810 50 840 50C870 50 890 70 890 90C890 110 870 130 840 130C810 130 790 110 790 90"
        style={{ strokeLinecap: "round" }}
        initial={initialProps}
        animate={animateProps}
        transition={{
          duration: calc(0.8),
          ease: "easeInOut",
          delay: calc(5.9),
          opacity: { duration: 0.4, delay: calc(5.9) },
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </motion.svg>
  );
}

export { AppleHelloChiaMaEffect as AppleHelloEnglishEffect }; 