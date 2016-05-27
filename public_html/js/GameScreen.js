/**
 * Object represent the main game play screen.
 */

/**
 * Creates a new GameScreen
 * @param {type} width The width of the canvas
 * @param {type} height The height of the canvas
 * @param {type} screenController The screen controller
 * @param {type} score The score of the user entering this screen.
 */
function GameScreen(width, height, screenController, score, level, achievements) {
    this.score = score === undefined ? 0 : score;
    this.level = level === undefined ? 1 : level;

    this.achievements = achievements === undefined ? [] : achievements;

    this.PUMP_INTERVAL = 4000;
    this.CELL_DIMENSIONS = 50;
    this.PIPES_PLACED_BEFORE_PLAY = 5;
    this.PASS_LEVEL_SCORE = 200;
    this.ACHIEVEMENT_LENGTH = 3000;

    this.achievementTimeout = 0;
    this.lastAchievement = null;

    this.GRID_LOCATION = new Vector(30, 35);
    this.PIPE_SELECTION_LOCATION = new Vector(53, 300);
    this.SETTINGS_LOCATION = new Vector(0, 10);

    var outer = this;
    this.settingsButton = new SettingsButton(function () {
        screenController.setScreen(new SettingsScreen(width, height, screenController, outer, true));
    });

    this.playing = true;

    this.pipesPlaced = 0;

    this.elapsedSinceLastPump = this.PUMP_INTERVAL;

    this.pipeSelection = new PipeSelectionQueue();
    this.grid = new Grid(this.CELL_DIMENSIONS, 6, 7);

    this.drains = [];
    this.pump = Pipes.Pump.create();

    this.GRID_LOCATION.x = (width - this.grid.getBounds().width) / 2;

    this.PIPE_SELECTION_LOCATION.x = (width - this.pipeSelection.getBounds().width) / 2;
    this.PIPE_SELECTION_LOCATION.y = this.GRID_LOCATION.y + this.grid.getBounds().height + 20;

    this.PUMP_INTERVAL_MAX = 7000;
    this.PUMP_INTERVAL_MIN = 3000;

    var numDrains = Math.floor(Math.min(5, ((this.level - 1) / 3) + 1));

    this.PUMP_INTERVAL = this.PUMP_INTERVAL_MIN + (this.PUMP_INTERVAL_MAX - this.PUMP_INTERVAL_MIN) * ((3 - (((this.level - 1) % 3)))) / 3.0;

    this.generateLevel(numDrains, 1.4143);

    this.draggingPipe = null;
    this.draggingLocation = new Vector(0, 0);

    this.newlyFilledPipes = [];

    this.fillPipeSelection();

    this.screenController = screenController;
    this.width = width;
    this.height = height;
    this.lastActiveControl = null;

    this.SETTINGS_LOCATION.x = this.GRID_LOCATION.x + (this.CELL_DIMENSIONS * 6);

    if (this.level === 5) {
        this.addAchievement(Achievement.FiveRounds);
    }
}

GameScreen.prototype.addAchievement = function (achievement) {
    this.achievements.push(achievement);
    lowLag.play('sound/achievementUnlocked.wav');

    this.achievementTimeout = this.ACHIEVEMENT_LENGTH;
    this.lastAchievement = achievement;
};

/**
 * Randomized the placement of the specified object on the game grid.
 * @param {type} object The object to place on the game grid.
 */
GameScreen.prototype.randomizePlacement = function (object, minDistance, avoidSet, clearConnections) {
    object.detach();
    var gridBounds = this.grid.getCellBounds();

    var location;
    var x = 0;

    placementLoop:
            for (var x = 0; x < 100000; x++) {
        location = new Vector(Math.floor(Math.random() * gridBounds.width),
                Math.floor(Math.random() * gridBounds.height));

        if (this.grid.getPipe(location) !== null)
            continue;

        var connectionDirections = object.getDirections();

        if (clearConnections === true) {
            for (var i = 0; i < connectionDirections.length; i++) {
                var dirLocation = location.add(connectionDirections[i].delta);

                if (!this.grid.getCellBounds().contains(dirLocation) || this.grid.getPipe(dirLocation) !== null)
                    continue placementLoop;
            }
        }

        if (minDistance !== undefined && avoidSet !== undefined) {
            var gridPipes = this.grid.getPipes();
            for (var i = 0; i < gridPipes.length; i++)
            {
                var gridPipe = gridPipes[i];

                if (avoidSet.indexOf(gridPipe.type) < 0)
                    continue;

                if (gridPipe.getLocation().difference(location).getLength() < minDistance)
                    continue placementLoop;
            }
        }

        break;
    }

    this.grid.setPipe(location, object);

    return true;
};

/**
 * Generates a solvable game level.
 * @param {type} minDistance The minimum distance between the pump & pipe.
 * @param {type} maxDistance The maximum distance between the pump & pipe.
 * @param {type} drainLocation The location of the drain in the last level.
 * @returns {undefined}
 */
GameScreen.prototype.generateLevel = function (numDrains, minDistance) {
    Math.seedrandom(this.level);
    var complexPipes = Pipes.complexValues();

    var splits = [];
    for (var i = 0; i < numDrains - 1; i++)
        splits[i] = complexPipes[Math.floor(Math.random() * complexPipes.length)].create();

    for (var i = 0; i < numDrains; i++)
        this.drains[i] = Pipes.Drain.create();

    generateWorld:
            do {
                this.randomizePlacement(this.pump, undefined, true);

                for (var i = 0; i < this.drains.length; i++) {
                    var drain = this.drains[i];

                    this.randomizePlacement(drain, minDistance, new Array(Pipes.Drain), false);
                }

                for (var i = 0; i < splits.length; i++) {
                    this.randomizePlacement(splits[i], 1.4143, Pipes.complexValues().concat(Array(Pipes.Pump)), true);
                }

                for (var i = 0; i < this.drains.length; i++) {
                    var delta = this.drains[i].getLocation().difference(this.pump.getLocation());
                    if (delta.x === 0 || delta.y === 0)
                        continue generateWorld;
                }
            } while (!this.isLevelSolvable());

};

/*
 * Tests whether the level is solvable in its current state.
 * @returns {Boolean} Whether the level is solvable.
 */
GameScreen.prototype.isLevelSolvable = function () {
    var pathFinder = new AStarPathFinder(this.grid);

    var solvable = true;
    for (var i = 0; i < this.drains.length; i++) {
        solvable = solvable && pathFinder.findPath(this.pump.getLocation(), this.drains[i].getLocation(), this.pump.getDirections()[0]) !== null;
    }

    return solvable;
};

/**
 * Refreshes the pipe selection area with new pipes.
 */
GameScreen.prototype.refreshPipeSelection = function () {
    this.pipeSelection.clear();
    this.fillPipeSelection();
};

/**
 * Fills the pipe selection area with new pipes in open slots.
 */
GameScreen.prototype.fillPipeSelection = function () {
    var pipes = Pipes.values();
    var containedPipes = [];

    var queuePipes = this.pipeSelection.getPipes();

    for (var i = 0; i < queuePipes.length; i++)
        containedPipes.push(queuePipes[i].type);

    for (var i = 0; i < pipes.length; i++)
    {
        if (containedPipes.indexOf(pipes[i]) < 0)
        {
            this.pipeSelection.pushPipe(pipes[i].create());
        }
    }
};

/**
 * Shifts a new pipe in from the right hand side of the pipe selection queue.
 */
GameScreen.prototype.shiftInPipe = function () {
    var pipes = Pipes.values(false);

    //Count number of useable pipes in selection queue.
    var containedUseablePipe = 0;
    var containedPipes = this.pipeSelection.getPipes();

    //Go to length - 1 because it will be shifted out.
    for (var i = 1; i < containedPipes.length - 1; i++) {
        if (this.isPipeUseable(containedPipes[i].type))
            containedUseablePipe++;
    }

    var pipe = pipes[Math.floor(Math.random() * pipes.length)];
    //If there are no useable pipes, make sure we add one.
    if (containedUseablePipe === 0) {
        var useful = this.getUsefulPipe();
        pipe = useful === null ? pipe : useful;
    }

    this.pipeSelection.shiftIn(pipe.create());
};

/**
 * Gets a useful pipe.
 * @returns {Pipe} A pipe that is useable.
 */
GameScreen.prototype.getUsefulPipe = function () {
    var pipes = Pipes.values();
    var pipe = null;

    for (var i = 0; i < 1000; i++) {
        pipe = pipes[Math.floor(Math.random() * pipes.length)];
        if (this.isPipeUseable(pipe))
            return pipe;
    }

    return null;
};

/**
 * Tests whether the specified pipe is useable.
 * @param {type} pipeType The type of the pipe to test the usability off.
 * @returns {Boolean} Whether the pipe is useable.
 */
GameScreen.prototype.isPipeUseable = function (pipeType) {
    var pipe = pipeType.create();
    pipe.fill(null);
    var starts = [];

    if (this.newlyFilledPipes.length > 0) {
        for (var i = 0; i < this.newlyFilledPipes.length; i++) {
            starts.push(this.newlyFilledPipes[i]);
        }
    } else
        starts.push(this.pump);

    var pathFinder = new AStarPathFinder(this.grid);

    for (var i = 0; i < starts.length; i++) {
        var drainDirections = this.getDrainDirections(starts[i]);

        for (var x = 0; x < drainDirections.length; x++) {
            var newLocation = starts[i].getLocation().add(drainDirections[x].delta);

            if (this.grid.getPipe(newLocation) !== null ||
                    !this.grid.getCellBounds().contains(newLocation))
                continue;

            this.grid.setPipe(newLocation, pipe);

            var useable = false;
            //Check if pipe is connecting to the start point
            if (pipe.getConnections().indexOf(starts[i]) >= 0) {
                var newDrainDirections = this.getDrainDirections(pipe);
                for (var y = 0; y < newDrainDirections.length; y++) {
                    var testLocation = pipe.getLocation().add(newDrainDirections[i].delta);

                    if (!this.grid.getCellBounds().contains(testLocation))
                        continue;

                    for (var i = 0; i < this.drains.length; i++) {
                        if (this.drains[i].isFilled())
                            continue;

                        useable = useable || pathFinder.findPath(pipe.getLocation(), this.drains[i].getLocation(), newDrainDirections[i]) !== null;
                    }
                }
            }

            this.grid.clearPipe(newLocation);

            if (useable)
                return true;
        }
    }

    return false;
};

GameScreen.prototype.loseGame = function (leaked) {
    this.playing = false;
    this.screenController.setScreen(new GameOverScreen(this.width, this.height, this.screenController, this.score));
};

/**
 * Updates game screen logic. Controls pumping.
 * @param {Number} deltaTime The delta in milliseconds from last call to update.
 */
GameScreen.prototype.update = function (deltaTime) {
    this.searchForEasterEgg();

    if (!this.playing)
        return;

    this.achievementTimeout = Math.max(0, this.achievementTimeout - deltaTime);

    var pipes = this.grid.getPipes();
    for (var i = 0; i < pipes.length; i++)
    {
        if (pipes[i].isLeaking() && pipes[i] !== this.drain && pipes[i] !== this.drain)
        {
            this.loseGame(true);
        }
    }

    if (true)
    {
        this.elapsedSinceLastPump += deltaTime;

        if (this.elapsedSinceLastPump > this.PUMP_INTERVAL)
        {
            this.elapsedSinceLastPump = 0;
            this.newlyFilledPipes = this.grid.pump();

            var filledDrains = 0;
            for (var i = 0; i < this.drains.length; i++)
            {
                if (this.drains[i].isFilled())
                    filledDrains++;
            }


            if (this.newlyFilledPipes.length === 0 && filledDrains > 0)
            {
                this.loseGame(false);
            }

            if (filledDrains === this.drains.length) {
                lowLag.play('sound/winsound.wav');

                this.screenController.setScreen(new GameScreen(this.width, this.height, this.screenController, this.score + this.PASS_LEVEL_SCORE - this.pipesPlaced * 2, this.level + 1, this.achievements));
                this.playing = false;
            }

            this.fillPipeSelection();
        }
    }
};

/**
 * Searches for the easter egg condition
 */

GameScreen.prototype.searchForEasterEgg = function () {
    var pipes = this.grid.getPipes();
    for (var i = 0; i < pipes.length; i++) {
        var pipe = pipes[i];

        if (pipe.type === Pipes.RightDown) {
            var right = this.grid.getPipe(pipe.getLocation().add(Direction.Right.delta));
            var down = this.grid.getPipe(pipe.getLocation().add(Direction.Down.delta));
            var accross = this.grid.getPipe(pipe.getLocation().add(Direction.Down.delta.add(Direction.Right.delta)));

            if (right === null || down === null || accross === null)
                continue;

            if (right.type === Pipes.LeftDown && down.type === Pipes.RightUp && accross.type === Pipes.LeftUp)
            {
                if (!pipe.isFilled()) {
                    pipe.setAsPump();
                }

                if (this.achievements.indexOf(Achievement.Infinity) < 0) {
                    this.addAchievement(Achievement.Infinity);
                }
            }
        }
    }
};

/**
 * Draws game screen.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */
GameScreen.prototype.draw = function (g, x, y) {
    g.font = "15px Trade Winds";
    g.fillText("Number of pipes used: " + this.pipesPlaced, this.GRID_LOCATION.x, 23); // missing the function that counts the number of pipes used

    g.fillText("Level: " + this.level, this.GRID_LOCATION.x + 220, 23); // missing the function that counts the number of pipes used

    this.grid.draw(g, this.GRID_LOCATION.x + x, this.GRID_LOCATION.y + y);
    this.pipeSelection.draw(g, this.PIPE_SELECTION_LOCATION.x + x, this.PIPE_SELECTION_LOCATION.y + y);
    this.settingsButton.draw(g, this.SETTINGS_LOCATION.x + x, this.SETTINGS_LOCATION.y + y);

    this.drawWater(g, x, y);

    if (this.draggingPipe !== null)
        this.draggingPipe.draw(g, x + this.draggingLocation.x, y + this.draggingLocation.y);


    if (this.achievementTimeout > 0) {
        g.font = "30px Trade Winds";
        var str = "Achievement: " + this.lastAchievement.name;
        var txtDim = g.measureText(str);
        g.fillText(str, (this.width - txtDim.width) / 2, this.GRID_LOCATION.y + this.CELL_DIMENSIONS * 2); // missing the function that counts the number of pipes used 
        this.lastAchievement.graphic.draw(g, (this.width - this.lastAchievement.graphic.getBounds().width / 2) / 2, this.GRID_LOCATION.y + this.CELL_DIMENSIONS * 4);
    }
};

/**
 * On mouse down event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
GameScreen.prototype.onMouseDown = function (location) {
    var selectionBounds = this.pipeSelection.getBounds().add(this.PIPE_SELECTION_LOCATION);
    this.onMouseMove(location);

    if (selectionBounds.contains(location)) {
        var pipe = this.pipeSelection.popPipe(location.difference(this.PIPE_SELECTION_LOCATION));
        this.draggingPipe = pipe;
        this.draggingLocation = location;
        lowLag.play('sound/Sound 2.wav');
    }
    if (this.lastActiveControl !== null)
        this.lastActiveControl.onMouseDown(location);
};

/**
 * On mouse up event handler.
 * @param {Vector} location Location of mouse cursor during event.
 */
GameScreen.prototype.onMouseUp = function (location) {
    if (this.draggingPipe !== null) {
        var gridBounds = this.grid.getBounds().add(this.GRID_LOCATION);

        if (gridBounds.contains(location)) {
            var gridCoord = this.grid.screenToGrid(location.difference(this.GRID_LOCATION));

            var oldPipe = this.grid.getPipe(gridCoord);

            if (oldPipe !== null && !oldPipe.canReplace()) {
                this.pipeSelection.pushPipe(this.draggingPipe);
                lowLag.play('sound/error.wav');
            } else {
                this.grid.setPipe(gridCoord, this.draggingPipe);
                this.pipesPlaced++;
                this.draggingPipe = null;
                lowLag.play('sound/Sound 3.wav');

                if (this.pipesPlaced == 10 && this.achievements.indexOf(Achievement.TenPipes) < 0)
                    this.addAchievement(Achievement.TenPipes);
            }
        } else {
            this.pipeSelection.pushPipe(this.draggingPipe);
            lowLag.play('sound/error.wav');
        }
    }

    this.draggingPipe = null;

    if (this.lastActiveControl !== null)
        this.lastActiveControl.onMouseUp(location);
};

/**
 * Handles mouse move events.
 * @param {type} location The current location of the mouse.
 */
GameScreen.prototype.onMouseMove = function (location) {
    var selectedControl = null;

    if (this.draggingPipe !== null)
        this.draggingLocation = location;

    if (this.settingsButton.getBounds().add(this.SETTINGS_LOCATION).contains(location))
        selectedControl = this.settingsButton;

    if (selectedControl !== this.lastActiveControl) {
        if (this.lastActiveControl !== null)
            this.lastActiveControl.onMouseLeave();

        if (selectedControl !== null)
            selectedControl.onMouseEnter();
    }

    this.lastActiveControl = selectedControl;
};

/**
 * Draws game water.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 */

GameScreen.prototype.drawWater = function (g, x, y) {

    var pipes = this.grid.getPipes();

    for (var i = 0; i < pipes.length; i++)
        this.drawPipeWater(g, x, y, pipes[i]);
};

/**
 * Draws water effects for individual pipe.
 * @param {Context2D} g Graphics context object through which to draw.
 * @param {Number} x The draw offset
 * @param {Number} y The draw offset
 * @param {Pipe} pipe The pipe to draw water effects for.
 */
GameScreen.prototype.drawPipeWater = function (g, x, y, pipe) {
    if (!pipe.isFilled() || pipe.type == Pipes.Drain)
        return;

    var inProgression = Math.min(1.0, this.elapsedSinceLastPump / (this.PUMP_INTERVAL / 2));
    var outProgression = Math.max(0, this.elapsedSinceLastPump / (this.PUMP_INTERVAL / 2) - inProgression);

    if (this.newlyFilledPipes.indexOf(pipe) === -1)
        inProgression = outProgression = 1.0;

    var pipeCentreLocation = this.GRID_LOCATION.add(this.grid.gridToScreen(pipe.getLocation().add(new Vector(0.5, 0.5))));

    var fillDirections = this.getFillDirections(pipe);
    var drainDirections = this.getDrainDirections(pipe);

    g.lineWidth = 8;
    g.strokeStyle = "#003399";

    for (var i = 0; i < fillDirections.length; i++) {
        var start = pipeCentreLocation.add(fillDirections[i].delta.scale(this.grid.getCellDimensions() / 2));
        var end = pipeCentreLocation.add(fillDirections[i].delta.inverse().scale(g.lineWidth / 2));
        var diff = end.difference(start);
        var current = start.add(diff.scale(inProgression));

        g.beginPath();
        g.moveTo(start.x, start.y);
        g.lineTo(current.x, current.y);
        g.stroke();
    }

    for (var i = 0; i < drainDirections.length; i++) {
        var start = pipeCentreLocation;
        var end = pipeCentreLocation.add(drainDirections[i].delta.scale(this.grid.getCellDimensions() / 2));
        var diff = end.difference(start);

        var current = start.add(diff.scale(outProgression));

        g.beginPath();
        g.moveTo(start.x, start.y);
        g.lineTo(current.x, current.y);
        g.stroke();
    }

    g.beginPath();
};

/**
 * Gets directions respective to pipe that the pipe is being filled through
 * @param {Pipe} pipe
 * @returns {Array|GameScreen.prototype.getFillDirections.fillDirections}
 */
GameScreen.prototype.getFillDirections = function (pipe) {
    var connections = pipe.getConnections(null);
    var fillDirections = [];

    for (var i = 0; i < connections.length; i++) {
        if (connections[i].isFilled()) {
            var delta = connections[i].getLocation().difference(pipe.getLocation());
            fillDirections.push(Direction.fromVector(delta));
        }
    }

    return fillDirections;
};

/**
 * Gets directions in respect to pipe of where the pipe is draining to.
 * @param {Pipe} pipe
 * @returns {Array|GameScreen.prototype.getDrainDirections.drainDirections}
 */
GameScreen.prototype.getDrainDirections = function (pipe) {
    var fillDirections = this.getFillDirections(pipe);
    var allDirections = pipe.getDirections();
    var drainDirections = [];

    for (var i = 0; i < allDirections.length; i++)
    {
        if (fillDirections.indexOf(allDirections[i]) === -1)
            drainDirections.push(allDirections[i]);
    }

    return drainDirections;
};

/**
 * Handles key events for this screen.
 * @param {type} keyCode The key code for the key that was pressed.
 */
GameScreen.prototype.onKeyDown = function (keyCode) {

};
