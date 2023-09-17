function AutbLayout({ children }) {
	return (
		<main className="flex items-center justify-center w-full h-full ">
			<div className="flex items-center justify-center w-full h-full md:w-3/4 md:h-5/6 md:shadow-xl md:rounded-lg">
				<aside className="hidden h-full w-1/2 bg-primary rounded-l-lg font-pacifico md:flex items-center justify-center text-9xl text-white">
					Sup!
				</aside>
				<section className="h-max w-full shadow-xl md:w-1/2 md:h-full md:shadow-none rounded-r-lg bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
					{children}
				</section>
			</div>
		</main>
	);
}

export default AutbLayout;
