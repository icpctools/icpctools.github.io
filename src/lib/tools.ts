import { base } from '$app/paths';

export interface Tool {
	slug: string;
	name: string;
	icon: string;
	/** One-line description for the home page */
	tagline: string;
	/** Page meta description */
	description: string;
	/** GitHub repo (in the icpctools org) the tool is released from */
	repo: string;
	/** Path to the tool's README.md within its repo */
	readme: string;
	/** Page content */
	body: string;
}

const CDS = `${base}/cds`;

export const tools: Tool[] = [
	{
		slug: 'cds',
		name: 'Contest Data Server',
		icon: 'fas fa-server',
		tagline: 'Single-point URL services for accessing contest data',
		description:
			'The Contest Data Server is a software component designed to allow secure, authenticated HTTP connections to contest data residing on a contest network',
		repo: 'icpctools',
		readme: 'CDS/README.md',
		body: `
<p>The Contest Data Server (CDS) is a software component designed to allow secure,
authenticated HTTP connections to contest data residing on a contest network.
It provides <a href="https://en.wikipedia.org/wiki/Representational_state_transfer">REST</a>
entry points for accessing a variety of contest-related services, allowing clients
to access those services via standard HTTP requests.</p>
<p>The CDS provides authentication services using configuration
data supplied by the Contest Administrator (CA).
Authenticated users can be assigned <em>roles</em> by the CA; user access
to specific services is governed by the role(s) assigned to them.</p>
<p>The set of services made available by the CDS is dependent on the facilities available on the contest network.
Examples of services which the CDS knows how to support (assuming that the contest network provides the back-end data
required and that the CA configures their use into the CDS) include:</p>
<ul>
<li>an overview description of the contest (title, date, etc.)</li>
<li>a Countdown Clock for the start of the contest</li>
<li>the current contest time (time remaining in the contest)</li>
<li>the contest configuration, as defined by any of several standard file types (contest.yaml, problemset.yaml, teams.tsv, etc.)</li>
<li>the current backup copy of any specified team's home directory</li>
<li>the event feed as provided by the Contest Control System (CCS)</li>
<li>images for each team and for each team's University Logo</li>
<li>"reaction videos" showing a team's web camera at the moment they received a run submission response from the judges</li>
<li>the current contest scoreboard</li>
<li>an RSS feed for the contest</li>
<li>the set of files which a team submitted to the judges for a specific run</li>
</ul>
<p>Note that a <a href="https://ghcr.io/icpctools/cds">container image</a> also exists for the CDS.</p>`
	},
	{
		slug: 'resolver',
		name: 'Resolver',
		icon: 'fas fa-trophy',
		tagline: 'Animated reveal of final contest results',
		description:
			'The ICPC Resolver is a tool for graphical animation of contest results. It shows the final runs submitted during a contest in an interesting way, and leads up to display of the award winners',
		repo: 'icpctools',
		readme: 'Resolver/README.md',
		body: `
<p>The <em>ICPC Resolver</em> is a tool for graphical animation of contest results.
It shows the final runs submitted during a contest in an
interesting way, and leads up to display of the award winners.
The Resolver concept was created by Fredrik Niemela and Mattias de Zalenski
at KTH Royal Technical University.
The ICPC Tools Resolver implementation was developed by Tim deBoer of
IBM Corporation.</p>
<p>The Resolver is designed to be used in contests where the scoreboard is "frozen"
prior to the end of the contest - that is, where the result of runs submitted in the
last part of the contest are not displayed on the scoreboard
(such runs are typically marked as "pending").
The Resolver produces a dynamic display by stepping through ("resolving") pending runs
and generating displays showing the contest winners in ranked order,
along with citations for awards earned.</p>
<p>After displaying an introductory "splash screen",
a single keystroke or mouse click causes the Resolver
to display the contest standings as of the time the scoreboard was frozen.
A key or mouse click then causes it to advance to the bottom of the standings;
a subsequent key/click starts the "resolving" process:
starting at the bottom, it moves up until it reaches a team that has one or more
pending submissions during the freeze time.
Each pending run is 'resolved' (to either a "yes" or "no" judgment),
and if the run was successful the team
will move 'up' into their new position based on the results.</p>
<p>Options allow you to configure when the resolver pauses, but by default it will
continue moving up and resolving until it gets to an 'interesting' case -
typically a first-to-solve award, a "group" or "region" winner,
or a gold/silver/bronze award winner. When it reaches an award, the resolver will pause
and switch to a screen showing the team name,
the logo and image (if available from a CDS; see below), and an award citation.
Once the award has been handed out, clicking returns to the regular Resolver
screen and continues the resolving process.</p>
<p>A variety of options are available, including managing the speed at which the
Resolver runs, controlling various "single-step" operations,
configuring categories of awards to be acknowledged during the resolving
process, and controlling simultaneous Resolver operations at multiple contest sites.</p>`
	},
	{
		slug: 'pres-admin',
		name: 'Presentation Admin',
		icon: 'fas fa-user-cog',
		tagline: 'Remote administration of multiple presentations (requires CDS)',
		description:
			'The Presentation Admin is one of the components comprising the ICPC Presentation System',
		repo: 'icpctools',
		readme: 'PresAdmin/README.md',
		body: `
<p>The <em>Presentation Admin</em> is one of the components
comprising the ICPC <em>Presentation System</em>.
The other major components of the Presentation System
are the <em>Presentation Client</em> and a collection of <em>presentations</em>.</p>
<p>The ICPC Presentation System defines a large number of built-in
"presentations", each of which displays programming contest-related
data in some fashion.  For example, one presentation shows the
<em>current contest scoreboard</em>, scrolling it automatically from the current
leaders down through all contenders and then repeating.
Other presentations show data such as the languages being used,
the current number of solutions to each contest problem,
notifications that a particular team has just solved a particular problem,
and so forth, all updating in real time based on input from a
Contest Control System (CCS).
There are also pre-defined presentations for showing a variety of user-selected
data such as team photographs, contest logos and related images,
local sites of interest, fireworks for the end
of the contest, and so forth.</p>
<p>The ICPC Presentation System will work with any
CCS that produces an event feed which is
compliant with the <a href="https://ccs-specs.icpc.io/2026-01/contest_api"><em>CLI Contest API</em></a>.
Systems known to produce compliant event feeds include
<a href="https://pc2ccs.github.io">PC-Squared</a>,
<a href="https://www.kattis.com/">Kattis</a> and <a href="https://www.domjudge.org">DOMjudge</a>;
other Contest Control Systems may also produce compatible event feeds and
hence work with the Presentation System.</p>`
	},
	{
		slug: 'pres-client',
		name: 'Presentation Client',
		icon: 'fas fa-desktop',
		tagline: 'Animated display of scoreboard and other contest data',
		description:
			'The ICPC Presentation System provides a mechanism for generating slide show presentations containing user-provided images, photos, and a variety of live data from a running contest',
		repo: 'icpctools',
		readme: 'PresContest/README.md',
		body: `
<p>The ICPC Presentation System provides a mechanism for generating "slide show" presentations containing
user-provided images, photos, and a variety of live data from a running contest.
The Presentation System consists of two components: <em>Presentation Clients</em> and the <em>Presentation Admin</em>.
This document describes the Presentation Client component;
refer to the separate documentation on the Presentation Admin for an explanation of how that component operates.</p>
<p>A Presentation Client is a single process which displays (rotates between) one or more <em>presentations</em>.
The Presentation System contains a wide variety of built-in presentations, each of which is identified
by having both a <em>number</em> and a <em>title</em> (also referred to as its <em>name</em>).
Each presentation client is started by giving it a list of the
presentations (by number or title) that the client should display.  It is allowable to start multiple
simultaneous presentation clients, each displaying its own (possibly overlapping) set of presentations.
Each separate presentation client is typically run on a separate machine, with each machine connected
to a projector or large display to allow many people to watch. (At the ICPC World Finals, for example,
as many as 10 or more separate screens are displayed, each running its own specified sequence of presentations.)</p>
<p>Some built-in presentations incorporate data from a running contest.  For example, one presentation
knows how to display the current contest scoreboard, updating it as the contest progresses;
another displays a rising (animated) balloon, labeled with the appropriate team and problem letter/color,
whenever a team solves a problem;
another presentation shows a graph of the languages used to solve problems so far in the contest;
another shows the runs currently in the "judge's queue" and the judgment each runs receives
as it exits the queue;
still another presentation shows the current contest clock (remaining time);
and so forth.</p>`
	},
	{
		slug: 'balloon-util',
		name: 'Balloon Utility',
		icon: 'fas fa-print',
		tagline: 'Manages and prints which teams to award a balloon',
		description:
			'The ICPC Balloon Utility is a tool for keeping track of balloons earned by contest teams for successful run submissions',
		repo: 'icpctools',
		readme: 'BalloonUtility/README.md',
		body: `
<p>The ICPC Balloon Utility (BU) is a tool for keeping track of balloons earned by contest teams
for successful run submissions.  It receives submission information from one of several
input sources, displays information about each submission (such as the problem, team,
run ID, school, submission time, etc.) and optionally automatically prints "balloon
notification" messages to assist runners in delivering balloons.  It also provides
runners with an interactive mechanism for tracking delivered balloons, and is even
capable of printing maps showing runners where to go find the appropriate balloon
and where on the contest floor the receiving team is located (although instructions
for configuring it to do that are beyond the scope of this introductory guide).</p>`
	},
	{
		slug: 'coach-view',
		name: 'Coach View',
		icon: 'fas fa-binoculars',
		tagline: 'Ability to remotely see the camera and desktop of a team',
		description:
			"The Coach View is a software component designed to provide the ability for spectators to view either or both of a selected team's desktop or web camera during a contest",
		repo: 'icpctools',
		readme: 'CoachView/README.md',
		body: `
<p>The Coach View is a software component designed to provide the ability for spectators
(coaches as well as other interested people) to view either or both of a selected team's desktop (machine screen)
or web camera during a contest.  It requires that the Contest Administrator configure desktop
and/or webcam streaming from team machines during the contest, and also requires a
<a href="https://ccs-specs.icpc.io/2026-01/contest_api">Contest API</a> source that implements video streaming, for
example the ICPC Tools <a href="${CDS}">Contest Data Server</a>.</p>
<p>The Coach View provides the ability for a coach to select a specific team by name or team number and to view
either or both of that team's desktop and webcam video feeds.</p>
<p>Looking for a web-based alternative? <a href="${base}/team-view">Team View</a> runs in any browser
and is a direct replacement for the Coach View when run in kiosk mode.</p>`
	},
	{
		slug: 'contest-utils',
		name: 'Contest Utilities',
		icon: 'fas fa-wrench',
		tagline:
			'A variety of useful contest-related utilities: event feed checkers, floor map generators, submission extractors, and more!',
		description:
			'The contest utilities provide a number of tools for working with contest data, contest control systems, and the contest data server',
		repo: 'icpctools',
		readme: 'ContestUtil/README.md',
		body: `
<p>The contest utilities provide a number of tools for working with contest data, contest control systems, and the contest
data server.</p>`
	},
	{
		slug: 'team-view',
		name: 'Team View',
		icon: 'fas fa-tv',
		tagline:
			'Web app for watching contests: teams, scoreboard, and live webcam and desktop feeds',
		description:
			'Team View is a web application for watching ICPC programming contests: see the teams, track how they are doing, view the scoreboard, or watch live webcam and desktop feeds',
		repo: 'team-view',
		readme: 'README.md',
		body: `
<p>Team View is a web application for watching ICPC programming contests. It allows you to see
the teams that are competing, track how they're doing, view the scoreboard, or watch live
webcam and desktop feeds.</p>
<p>If you run Team View in a web browser in kiosk mode, it is a direct replacement for the
<a href="${base}/coach-view">Coach View</a>. But it is also much more:</p>
<ul>
<li>A performant web app for all contest data - runs on any client with minimal load on network and backend server.</li>
<li>Fully reactive - portions of the UI appear only when content is available, so for instance, if your contest
doesn't have video streaming or maps those options won't appear in the UI.</li>
<li>Responsive design - can be accessed on a phone, tablet, Raspberry Pi, or computer.</li>
<li>Reusable TypeScript libraries for accessing the <a href="https://ccs-specs.icpc.io">Contest API</a>
(<a href="https://www.npmjs.com/package/@icpctools/contest-api">@icpctools/contest-api</a>) and building contest UIs
(<a href="https://www.npmjs.com/package/@icpctools/contest-ui">@icpctools/contest-ui</a>).</li>
</ul>
<p>Team View works with any server that supports the 2023-06 or 2026-01 Contest API specifications,
such as the ICPC Tools <a href="${CDS}">Contest Data Server</a>.</p>
<p>Team View is also available as a multi-architecture (amd64 and arm64)
<a href="https://github.com/icpctools/team-view/pkgs/container/team-view">container image</a>. To configure
your backend Contest API server, set the following environment variables:</p>
<ul>
<li><code>CONTEST_URL</code> - The Contest API base URL, e.g. <code>http://cds/api/</code></li>
<li><code>CONTEST_ID</code> - Optional contest id, only required when more than one contest is configured.</li>
<li><code>CONTEST_USER</code> - A user on the contest server.</li>
<li><code>CONTEST_PASSWORD</code> - The user's password.</li>
</ul>
<pre><code>podman/docker run -p 3000:3000 \\
  -e CONTEST_URL=http://cds/api/ \\
  -e CONTEST_USER=user -e CONTEST_PASSWORD=password \\
  ghcr.io/icpctools/team-view</code></pre>`
	}
];

export function toolBySlug(slug: string): Tool | undefined {
	return tools.find((t) => t.slug === slug);
}
