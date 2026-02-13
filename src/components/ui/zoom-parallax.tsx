'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from "next/image";

interface ParallaxImage {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: ParallaxImage[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef<HTMLDivElement>(null);
	const [imagesLoaded, setImagesLoaded] = useState(false);

	// Preload images on mount
	useEffect(() => {
		const imagePromises = images.map(({ src }) => {
			return new Promise<void>((resolve) => {
				const img = new window.Image();
				img.src = src;
				img.onload = () => resolve();
				img.onerror = () => resolve(); // Still resolve on error to not block
			});
		});

		Promise.all(imagePromises).then(() => {
			setImagesLoaded(true);
		});
	}, [images]);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	// Use scrollYProgress directly - Lenis already provides smooth scrolling
	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden bg-black">
				{/* Loading state */}
				{!imagesLoaded && (
					<div className="absolute inset-0 flex items-center justify-center z-10">
						<div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
					</div>
				)}
				
				{/* Images - render even while loading for preload but with opacity */}
				<div className={`transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
					{images.map(({ src, alt }, index) => {
						const scale = scales[index % scales.length];

						return (
							<motion.div
								key={index}
								style={{ scale }}
								className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
							>
								<div className="relative h-[25vh] w-[25vw]">
									<Image
										src={src || '/placeholder.svg'}
										alt={alt || `Parallax image ${index + 1}`}
										fill
										sizes="(max-width: 768px) 100vw, 50vw"
										className="object-cover rounded-lg"
									/>
								</div>
							</motion.div>
						);
					})}
				</div>
				
				{/* Top fade overlay */}
				<div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent z-50 pointer-events-none" />
				
				{/* Bottom fade overlay */}
				<div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-50 pointer-events-none" />
			</div>
		</div>
	);
}

