#!/usr/bin/env bun
/**
 * PAI-OpenCode Installer — Update Steps (v3→v3.x)
 * 
 * 3-step update flow for within v3.x versions.
 */

import type { InstallState } from "./types";
import { updateV3, isUpdateNeeded } from "./update";
import { buildOpenCodeBinary } from "./build-opencode";
import type { UpdateResult } from "./update";

// ═══════════════════════════════════════════════════════════
// Step 1: Detected
// ═══════════════════════════════════════════════════════════

export interface UpdateDetectionResult {
	needed: boolean;
	currentVersion?: string;
	targetVersion: string;
	reason?: string;
}

export async function stepDetectUpdate(
	state: InstallState,
	onProgress: (percent: number, message: string) => void
): Promise<UpdateDetectionResult> {
	onProgress(0, "Checking for updates...");
	
	const detection = isUpdateNeeded();
	
	return {
		needed: detection.needed,
		currentVersion: detection.currentVersion,
		targetVersion: detection.targetVersion,
		reason: detection.reason,
	};
}

// ═══════════════════════════════════════════════════════════
// Step 2: Update
// ═══════════════════════════════════════════════════════════

export async function stepApplyUpdate(
	state: InstallState,
	onProgress: (percent: number, message: string) => void,
	skipBinaryUpdate: boolean = false
): Promise<UpdateResult & { binaryUpdated: boolean }> {
	onProgress(10, "Starting update...");
	
	// Apply core updates
	const updateResult = await updateV3({
		onProgress: async (message, percent) => {
			const mappedPercent = 10 + (percent * 0.7);
			onProgress(Math.round(mappedPercent), message);
		},
		skipBinaryUpdate: true, // We'll handle binary separately
	});
	
	// Update binary if needed
	let binaryUpdated = false;
	if (!skipBinaryUpdate && updateResult.success) {
		onProgress(80, "Checking OpenCode binary...");
		
		const buildResult = await buildOpenCodeBinary({
			onProgress: (message, percent) => {
				const mappedPercent = 80 + (percent * 0.15);
				onProgress(Math.round(mappedPercent), message);
			},
			skipIfExists: true,
		});
		
		binaryUpdated = !buildResult.skipped && buildResult.success;
	}
	
	return {
		...updateResult,
		binaryUpdated,
	};
}

// ═══════════════════════════════════════════════════════════
// Step 3: Done
// ═══════════════════════════════════════════════════════════

export async function stepUpdateDone(
	state: InstallState,
	result: UpdateResult & { binaryUpdated: boolean },
	onProgress: (percent: number, message: string) => void
): Promise<void> {
	onProgress(95, "Finalizing update...");
	
	// Ensure wrapper is up to date
	// Verify installation
	
	onProgress(100, "Update complete!");
}

// ═══════════════════════════════════════════════════════════
// Update UI Text
// ═══════════════════════════════════════════════════════════

export const UPDATE_UI_TEXT = {
	upToDate: {
		title: "✅ Up to Date",
		message: (version: string) => 
			`PAI-OpenCode ${version} is the latest version.`,
		button: "Launch PAI",
	},
	
	updateAvailable: {
		title: "🔄 Update Available",
		message: (current: string, target: string) => 
			`Update from ${current} to ${target}?`,
		details: [
			"• New features and improvements",
			"• Bug fixes",
			"• Settings preserved",
			"• ~2 minutes duration",
		],
		buttons: {
			skip: "Skip for now",
			update: "Update Now",
		},
	},
	
	updating: {
		title: "⏳ Updating...",
		message: "Please wait while we update PAI-OpenCode",
	},
	
	complete: {
		title: "✅ Update Complete",
		message: (version: string, binaryUpdated: boolean) => {
			let msg = `Successfully updated to ${version}`;
			if (binaryUpdated) {
				msg += " with new OpenCode binary";
			}
			return msg;
		},
		button: "Launch PAI",
	},
};
