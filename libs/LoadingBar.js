class LoadingBar {
	constructor(options) {
		// Fullscreen overlay
		this.domElement = document.createElement("div");
		this.domElement.style.position = 'fixed';
		this.domElement.style.top = '0';
		this.domElement.style.left = '0';
		this.domElement.style.width = '100%';
		this.domElement.style.height = '100%';
		this.domElement.style.background = '#0a000f'; // Very dark background
		this.domElement.style.opacity = '0.9';
		this.domElement.style.display = 'flex';
		this.domElement.style.flexDirection = 'column';
		this.domElement.style.alignItems = 'center';
		this.domElement.style.justifyContent = 'center';
		this.domElement.style.zIndex = '1111';
		this.domElement.style.fontFamily = 'Arial, sans-serif';

		// Progress Text
		this.percentText = document.createElement("div");
		this.percentText.style.color = '#00f6ff';
		this.percentText.style.fontSize = '20px';
		this.percentText.style.marginBottom = '10px';
		this.percentText.style.textShadow = '0 0 5px #00f6ff, 0 0 10px #00f6ff';
		this.percentText.innerText = '0%';
		this.domElement.appendChild(this.percentText);

		// Outer bar (track)
		const barBase = document.createElement("div");
		barBase.style.background = '#1a001f'; // dark red
		barBase.style.width = '50%';
		barBase.style.minWidth = '250px';
		barBase.style.borderRadius = '10px';
		barBase.style.height = '15px';
		barBase.style.boxShadow = '0 0 10px #ff073a, 0 0 20px #ff073a'; // neon red glow
		this.domElement.appendChild(barBase);

		// Inner progress bar
		const bar = document.createElement("div");
		bar.style.background = '#00f6ff'; // neon blue
		bar.style.borderRadius = '10px';
		bar.style.height = '100%';
		bar.style.width = '0%';
		bar.style.transition = 'width 0.3s ease-out';
		bar.style.boxShadow = '0 0 10px #00f6ff, 0 0 20px #00f6ff, 0 0 30px #00f6ff'; // neon blue glow
		barBase.appendChild(bar);

		this.progressBar = bar;

		document.body.appendChild(this.domElement);
	}

	set progress(delta) {
		const percent = Math.min(100, Math.max(0, delta * 100));
		this.progressBar.style.width = `${percent}%`;
		this.percentText.innerText = `${Math.floor(percent)}%`;
	}

	set visible(value) {
		this.domElement.style.display = value ? 'flex' : 'none';
	}
}

export { LoadingBar };
