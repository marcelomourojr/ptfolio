'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface ParallaxImage {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Exatamente 7 imagens: o posicionamento abaixo é fixo por índice. */
	images: ParallaxImage[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[300vh]">
			<div className="sticky top-0 h-screen overflow-hidden bg-black">
				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							/* O items-center/justify-center aqui é mecânica do efeito — cada
							   imagem parte do centro antes de receber o deslocamento por
							   índice. Não é decisão de composição. */
							className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 0 ? 'z-20' : 'z-10'} ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!w-auto [&>div]:!aspect-[1179/2556] [&>div]:!h-[45vh]' : ''} ${index === 3 ? '[&>div]:!top-[2vh] [&>div]:!left-[27.5vw] [&>div]:!h-auto [&>div]:!aspect-[3/2] [&>div]:!w-[27vw]' : ''} ${index === 4 ? '[&>div]:!top-[33vh] [&>div]:!left-[5vw] [&>div]:!h-auto [&>div]:!aspect-[3/2] [&>div]:!w-[22vw]' : ''} ${index === 5 ? '[&>div]:!top-[32vh] [&>div]:!-left-[27vw] [&>div]:!h-auto [&>div]:!aspect-[3/2] [&>div]:!w-[27vw]' : ''} ${index === 6 ? '[&>div]:!top-[32vh] [&>div]:!left-[31vw] [&>div]:!h-auto [&>div]:!aspect-[3/2] [&>div]:!w-[20vw]' : ''} `}
						>
							{/* rounded + ring: quando duas imagens encostam durante o
							    zoom, a borda é o que faz cada uma continuar legível como
							    peça separada em vez de virar um borrão só. */}
							<div className="relative h-[25vh] w-[25vw] overflow-hidden rounded-lg ring-1 ring-white/15">
								<Image
									src={src}
									alt={alt ?? ''}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									priority={index === 0}
									draggable={false}
						className="object-cover"
								/>
							</div>
						</motion.div>
					);
				})}

				{/* Único véu que sobrou: garante legibilidade do cabeçalho fixo
				    quando uma imagem clara passa por trás dele. */}
				<div className="pointer-events-none absolute inset-x-0 top-0 z-50 h-28 bg-gradient-to-b from-black to-transparent" />
			</div>
		</div>
	);
}
