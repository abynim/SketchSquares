#import 'library/helpers.js'

var kPluginName = "SketchSquares Plugin",
	kPluginDomain = "com.silverux.instagram-sketch-plugin"

function sendJSONCommands(params) {
	
	var sp = sketch.scriptPath,
		folder = [sp stringByDeletingLastPathComponent],
		appPath = folder + "/library/SketchSquaresPlugin.app",
		uniqueID = [[NSUUID UUID] UUIDString],
		tempFolderPath = getTempFolderPath("temp-commands/"+uniqueID),
		jsonPath = tempFolderPath + "/c.ssplugin",
		bundlePath = [[NSBundle mainBundle] bundlePath],
		appName = [[NSFileManager defaultManager] displayNameAtPath: bundlePath],
		d = [NSMutableDictionary new],
		val;
		
	for (var key in params) {
		val = params[key]
		[d setValue:val forKey:key]
	}
	[d setValue:kPluginDomain forKey:"pluginDomain"]
	[d setValue:sp forKey:"scriptPath"]
	[d setValue:folder forKey:"scriptFolder"]
	[d setValue:appName forKey:"appName"]
		
	var jData = [NSJSONSerialization dataWithJSONObject:d options:0 error:nil],
		jsonString = [[NSString alloc] initWithData:jData encoding:NSUTF8StringEncoding]
	
	createFolderForPath(tempFolderPath)
	writeTextToFile(jsonString, jsonPath)

	if(![[NSWorkspace sharedWorkspace] openFile:jsonPath withApplication:appPath]]) {
		showDialog("Could not launch plugin")
	}
}

function populateImages(images, replaceLayers) {
	if(selectionIsEmpty()) {
		showDialog("Nothing selected")
		return
	}
	
	var i = 0,
		targetFrame, bmpLayer;
		
	var loop = [selection objectEnumerator]
	while (layer = [loop nextObject]) {
		
		if (i < images.length) {
			
			if (replaceLayers == true) {
				targetFrame = getRect(layer)
				bmpLayer = addBitmap(images[i], [layer parentGroup], "Instagram Photo "+(i+1))
				setPosition(bmpLayer, targetFrame.x, targetFrame.y, true)
				setSize(bmpLayer, targetFrame.width, targetFrame.height)
				[bmpLayer select:true byExpandingSelection:(i!=0)]
				removeLayer(layer)
			} else {
				setBitmapFill(layer, images[i])
				[layer select:true byExpandingSelection:(i!=0)]
			}
			
			i++
			
		} else {
			break;
		}
	}
}
