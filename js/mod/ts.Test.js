Typeswift.prototype.Test = function(){
	var settings = new ts.LocalDataProxy();
	var testTimer = new ts.Timer();
	var stats = new ts.StatCounter()
	var isTestInitialized = false;
	var isTestStarted = false;
	var sCount = 0; // index of string to match against
	var kCount = 0; // keystroke count
	var mCount = 0; // mistake count
	var wCount = 0; // total words
	var wpm = 0;
	var keyboardType = settings.getVal("KEYBOARD") || "QWERTY"; // qwerty or dvorak
	log(keyboardType);
	var testType = ""; // for scores
	var testString = ""; // string to match
	var curLesson = 0;
	var lessonIndex = 0;
	var cursor = new ts.Timer(function(){
		$("#cursor").toggle();
		$(".curChar").toggleClass("cursorBlink");
	});
	cursor.setMillis(400);
	cursor.start();

	// these lessons are obviously very much in progress...
	var lessons = {
		"QWERTY" : [
			[ // test
				"aaa",
				"sss",
				"ddd"
			],
			[ // lesson 1
				"fff jjj fff jjj",
				"uuu hhh uuu hhh" /*,
				"uh uh uh uh",
				"hu hu hu hu",
				"huh huh huh huh",
				"uh huh uh huh uh huh uh huh",
				"h u uh hu uhh huh uhh",
				"h u uh hu uhh huh uhh" */
			],
			[ // lesson 2
				"eeee tttt eeee tttt",
				"eeee tttt eeee tttt",
				"et et et et",
				"tee tee tee tee",
				"tete tete tete tete",
				"eet eet eet eet",
				"t e et te teet tee teet tete et",
				"t e et te teet tee teet tete et"
			]
		]
		/*
		,
		"DVORAK" : [
			[ // test
				"aaa",
				"ooo"
			],
			[ // test
				"aaa",
				"ooo",
				"eee"
			],
			[ // lesson 1
				"uuu hhh uuu hhh",
				"uuu hhh uuu hhh",
				"uh uh uh uh",
				"hu hu hu hu",
				"huh huh huh huh",
				"uh huh uh huh uh huh uh huh",
				"h u uh hu uhh huh uhh",
				"h u uh hu uhh huh uhh"
			],
			[ // lesson 2
				"eeee tttt eeee tttt",
				"eeee tttt eeee tttt",
				"et et et et",
				"tee tee tee tee",
				"tete tete tete tete",
				"eet eet eet eet",
				"t e et te teet tee teet tete et",
				"t e et te teet tee teet tete et"
			]
		]
		*/
		
//	Dvorak lessons "borrowed" for non-commercial use from http://gigliwood.com/abcd/lessons/
,"DVORAK":[
["uuuu hhhh uuuu hhhh uuuu hhhh uuuu hhhh","uuuu hhhh uuuu hhhh uuuu hhhh uuuu hhhh","uh uh uh uh","hu hu hu hu","huh huh huh huh","uh huh uh huh uh huh uh huh","h u uh hu uhh huh uhh","h u uh hu uhh huh uhh"],
["eeee tttt eeee tttt eeee tttt eeee tttt","eeee tttt eeee tttt eeee tttt eeee tttt","et et et et","tee tee tee tee","tete tete tete tete","eet eet eet eet","t e et te teet tee teet tete et","t e et te teet tee teet tete et"],
["eeee hhhh tttt uuuu","eeee hhhh tttt uuuu","eeee hhhh tttt uuuu","hue hue hue hue tutu tutu tutu tutu the the the the he he he he he","teeth teeth teeth teeth hut hut hut hut","thee thee thee thee tutu tutu tutu tutu","eh he hue hut teeth teethe the thee tutu","eh he hue hut teeth teethe the thee tutu"],
["oooo nnnn oooo nnnn oooo nnnn oooo nnnn","oooo nnnn oooo nnnn oooo nnnn oooo nnnn","no no no no","on on on on","non non non non","noon noon noon noon","ono ono ono ono","no non noon on noo ono","no non noon on noo ono"],
["eeee hhhh nnnn oooo tttt uuuu","en en en en ho ho ho ho ne ne ne ne nu nu nu nu oh oh oh oh to to to to","hen hen hen hen hoe hoe hoe hoe hot hot hot hot Hun Hun Hun Hun","nee nee nee nee net net net net not not not not nun nun nun nun","nut nut nut nut one one one one out out out out ten ten ten ten","TNT TNT TNT TNT toe toe toe toe ton ton ton ton too too too too","tot tot tot tot tun tun tun tun"],
["hone hone hone hone hoot hoot hoot hoot hunt hunt hunt hunt","neon neon neon neon none none none none note note note note","noun noun noun noun onto onto onto onto Otto Otto Otto Otto","teen teen teen teen tent tent tent tent then then then then","thou thou thou thou tone tone tone tone toot toot toot toot","tote tote tote tote tout tout tout tout tune tune tune tune","tenet tenet tenet tenet tenth tenth tenth tenth tooth tooth tooth tooth"],
["Tune the tone","Note the teen not the tutu","Ten hot teeth tout the tune","The one nut to tote out the hen","None hunt out the tenth one ton nun","Hunt the neon then toot out the tune onto the tent"],
["aaaa ssss aaaa ssss aaaa ssss aaaa ssss","aaaa ssss aaaa ssss aaaa ssss aaaa ssss","as as as as","sa sa sa sa","sas sas sas sas","ass ass ass ass","sass sass sass sass","as a sass ass as a sas","as a sass ass as a sas"],
["aaaa eeee hhhh nnnn oooo ssss tttt uuuu","ah ah ah ah an an an an at at at at ha ha ha ha so so so so us us us us","ash ash ash ash San San San San sat sat sat sat sea sea sea sea","ease ease ease ease east east east east Haas Haas Haas Haas","Hans Hans Hans Hans hash hash hash hash sane sane sane sane","sash sash sash sash Sean Sean Sean Sean seat seat seat seat","Stan Stan Stan Stan"],
["Sean hates tetanus shots","Eat the toast at ten to noon","The Taos sun shone as hot as Santa Anna","Anthea assesses the estate at South Tahoe","Hotshot Hanna uses these shoes that Shannon soon sees","At noon on the teahouse Aunt Tess hushes the nauseous host","Annette senses the sensuous sunset onset on the Athens sea","Tess Sutton notates the tenuous state that southeast Houston has seen","Ethan Ness attests to these Tennessee Senate OSHA statutes to shun Utah"],
["iiii dddd iiii dddd iiii dddd iiii dddd","iiii dddd iiii dddd iiii dddd iiii dddd","id id id id","id id id id","did did did did","did did did did","Didi did id did i","Didi did id did i","uuuu hhhh iiii dddd","du du du du hi hi hi hi","dud dud dud dud hid hid hid hid"],
["aaaa dddd eeee hhhh iiii nnnn oooo ssss tttt uuuu","aaaa dddd eeee hhhh iiii nnnn oooo ssss tttt uuuu"],
["Tina is on hiatus instead","The statue is sent to Santa Anita","This session is tedious on the tendons","That Thai dish is intense on the sinuses","Onions stain satin so use this Tide on this","Dan Addison detonated the thousandth headstone","Estonian nationhood is a notion hidden in Asia","The tennis enthusiast hides the dots on his hands","Otis said that sand is the seed that Isis sent us","Ted Austin insinuated that Tunisia is in Indonesia","The Dissonant in the ninth edition hits on the Saudis","I insist that Adenine is in DNA and that andesine is not","Deanna and Eddie suntanned on the Tahitian seaside oasis","Indiana and Ohio do not need donated tissues and headsets","The attendant initiated an intense sound that suited Odessa","The dodo added nine and nineteen and attained nine thousand","Duane nodded to his sis as he situated his sedan in the shade","Dennis Hudson is hidden in a distant Tunisian hashish hideout","Nina and Dana hit the astonished attendee on the head in unison","Auntie Edith tends to hint that Edna heeds the ideas due to Satan","The idea that nineteen studious Dadaists assisted Einstein is asinine"],
["Todd hesitated in his Datsun then","hit the Honda in the side in an instantaneous THUD","The thesis that Dante dated Death is","as inane as the attitude that Sade stood on Sadness","A destitute Sudanese assassin insists","that sainthood is indeed a handout to heathenish idiots","A thousand nude deadheads sustained","hideous headstands as studious atheists dissented and seethed"],
["gggg pppp gggg pppp gggg pppp gggg pppp","gggg pppp gggg pppp gggg pppp gggg pppp","pg pg pg pg pg pg pg pg","gp gp gp gp gp gp gp gp","gggg hhhh pppp uuuu","up up up up hug hug hug hug pug pug pug pug pup pup pup pup","ugh ugh ugh ugh Hugh Hugh Hugh Hugh Pugh Pugh Pugh Pugh"],
["aaaa dddd eeee gggg hhhh iiii nnnn oooo pppp ssss tttt uuuu","aaaa dddd eeee gggg hhhh iiii nnnn oooo pppp ssss tttt uuuu"],
["The Huntington is in Pasadena","He has one pip on his insignia","I did not see Patton Against The Gestapo","I put the sponge onto the peg on the spigot","She did not postpone the hepatitis diagnosis","The USPS sent postage high on August eighteenth","Pete stops as he peeps at the Pepsi and doughnuts","Nothing is as stupendous as an independent opinion","I did not design this gadget that ignites potatoes","Neptune is the sea god and is the god Poseidon too","Do not dispute that pogo is as ingenious as ping pong","The suggestion that toothpaste is poisonous is stupid","I suggest that one not go to Saigon in a ship tonight","Giuseppe pigged out on antipasto and pungent spaghetti","The pianist is a passionate sap and sings insipid songs","Angus thought he needed a tenspot to snap up the headphones","Gina Esposito supposed that the signpost in Spain said STOP","The Spanish poet happened to paint his house indigo and sepia","Gus is assigned to get genuine snapshots inside the USGS ship","This pennant said Hastings on it and that one said Penn State","Gas Seepage in the Peugeot stopped the engine at the guidepost","Patti Eng has a PhD in the thespian sagas on Oedipus and Antigone","Tonight the teenage peasants appease the pagan suntanning goddess","The penguin gasped as its appendage pushed past the Patagonian ship","Seeing an aging ape eating pudding in a teaspoon is not too desponding","In this episode the patient hostages hug and sing despite the gunshots","Espionage at DuPont and Hughes is upsetting to the GOP and the Pentagon","Doug pauses as he puts the poinsettias and sagging petunias in the teapot","The indignant patient ingested a potent dosage to suspend his indigestion","Upsetting gossip at the pageant had Stephanie and Gina sidestepping opponents"],
["Pat goes sightseeing at the pagoda","in Shanghai despite the gunshots at its apogee","The passage on Pegasus and the Aegean Sea","upon page eight is a poignant adaptation","In hindsight Stonehenge suggests the","indigenous geniuses had to depend on the sun and its phases","Daphne Stephenson has gone to Ghana and","Ethiopia and Uganda to audiotape the distinguished singing","The Pope stood in position atop the","highest point in Santiago as an aghast Angie Diego ingested peanuts"],
["cccc .... cccc .... cccc .... cccc ....","cccc .... cccc .... cccc .... cccc ....","eeee cccc tttt ....","ec ec ec ec tc tc tc tc","ec ec ec ec tc tc tc tc","c. c. c. c. t. t. t. t. e. e. e. e.","c. c. c. c. t. t. t. t. e. e. e. e.","etc. etc. etc. etc. etc. etc. etc. etc.","etc. etc. etc. etc. etc. etc. etc. etc."],
["aaaa cccc dddd eeee gggg hhhh iiii nnnn oooo pppp ssss tttt uuuu ....","aaaa cccc dddd eeee gggg hhhh iiii nnnn oooo pppp ssss tttt uuuu ...."],
["I can accept this pecan pie.","Each disc costs ten cents each.","The census counts us each decade.","Couscous is cheapest in Connecticut.","Cincinnati and Chicago...each U.S.A. cities.","The didactic speech on Chopin educated Chad.","Isaac cannot teach us the Chattanooga Choo Choo.","Scott Chen teaches in oceanic science at Antioch.","The cadets deduced that such antics caused chaos.","His stethoscope suggested that Connie had congestion.","I contend that a Hitachi scope can decode this speech.","The octopus descended to the Titanic deep in the ocean.","U.N.E.S.C.O. accepted a chance at a conspicuous occupation.","The stagecoach continued to pass the cacti in scenic Tucson.","Capt. P. T. Cohen needs access to a tactician in this section.","Insecticide succeeds in contacting the insect in a picosecond.","Cognac and scotch is an inconspicuous choice...thought Candace.","Topnotch associates to authenticate the ancient Cantonese teacups.","Coco said coaching is a cinch...catch and toss...catch and toss....","The catsup accident at the picnic depicted Dutch as an apathetic nuisance.","It is no coincidence that this idiotic sentence has eight concise Cs in it.","The enthusiastic duchess noticed the Pontiac coupe...and decided to chase it."],
["I detect a headache...I hope it is not the","Schnapps and Cocoa I had as a nightcap.","The accountant...the C.P.A...conceded that","he had on occasion hidden cocaine in a coconut.","The cautious Canadian statisticians caught","inconsistencies in the second spacesuit design.","The Ph.D. conducted the Puccini Toccata...","an acoustic succession in succinct cacophonic staccato notes."],
["rrrr ,,,, rrrr ,,,, rrrr ,,,, rrrr ,,,,","rrrr ,,,, rrrr ,,,, rrrr ,,,, rrrr ,,,,","nnnn oooo rrrr ,,,,","or, or, or, or, ro, ro, ro, ro, nor, nor, nor, nor,","Orr, Orr, Orr, Orr, Ron, Ron, Ron, Ron, Orono, Orono, Orono, Orono"],
["aaaa cccc dddd eeee gggg hhhh iiii nnnn oooo pppp rrrr ssss tttt uuuu ,,,, ....","aaaa cccc dddd eeee gggg hhhh iiii nnnn oooo pppp rrrr ssss tttt uuuu ,,,, ...."],
["Schroeder desires a career as an orchestra conductor.","A recurring procedure irrigates the orchard and the prairie.","Harrison, Harriet, Arturo, and Christopher are grandparents.","Reagan arranged an airdrop, near the northern Pretoria corridor.","The erratic Richard Rodgers production returned to the Curran Theatre.","Carrie read the transportation report as Rosie rehearsed her transcript.","Roger that, in the circuit, the resistors and transistors are corroded.","The grocer reported that the antiperspirant had deteriorated.","Pierre Renoir regrets that Gerard Depardieu is not in Chartres, as desired.","Horns are characteristic to the rhinoceros and the Triceratops, a dinosaur.","Tia Carrere stars, narrates, and is the director in this torrid adaptation.","Gertrude, in her aristocratic grandeur, returned the carrots at the restaurant.","The Enterprise surprised Picard as it crisscrossed the restricted stratosphere."],
["Ritter, a character actor, returned an","uproarious retort to the irritating chairperson.","The rhetoric, the grandeur, and the","scripture interpretation surprised the churchgoer.","The choreographer restrained his rather","strong terpsichorean urges, and did not dance.","The oceanographer reports that the interior pressure is inappropriate and","erroneous, and orders the radar operator to intercept the pursuer."],
["Ed Harris stars as an arrogant and treacherous paratrooper, interpreting, in","error, orders to torture a geriatric instructor. Though his side has","surrendered, he continues to oppress and interrogate the retired grandparent.","The aggressor is arrested, arraigned, tried, and, appropriate to the horrors","he practiced, prosecuted and incarcerated. The granddaughter, a stenographer,","nurtures her grandpa, and he recuperates, though his arthritis returns.","In retrospect, that paragraph incorporated a preposterous R proportion."],
["llll '''' llll '''' llll '''' llll ''''","llll '''' llll '''' llll '''' llll ''''","LLLL \"\"\"\" LLLL \"\"\"\" LLLL \"\"\"\" LLLL \"\"\"\"","aaaa llll ssss ''''","all all all all la la la la A's A's A's A's","ala ala ala ala l's l's l's l's s's s's s's s's","Sal Sal Sal Sal lass lass lass lass Sal's Sal's Sal's Sal's"],
["aaaa cccc dddd eeee gggg hhhh iiii llll nnnn","oooo pppp rrrr ssss tttt uuuu '''' ,,,, ...."],
["\"Hello,\" Ellen laughed, as she collided into Allen.","In a nutshell, Clinton still had an electoral landslide.","The alcoholic general staged a coup d'etat in Tallahassee.","Lucille and Randall cleaned their plates in the candlelight.","Leland alleged that \"Gilligan's Island\" is a little illogical.","Sinead O'Connor's latest single isn't going to appall Russell.","Colonial landlords near London once said \"ain't,\" not \"isn't.\"","Caroline D'Arc is an enrollee at that college in Philadelphia.","Didn't she hear, Cal used lots o' laterals, in the last seconds.","Eileen O'Hare and Pat O'Shea still shouldn't tell Leslie O'Neill.","\"This little oriental elephant is a cultural sellout,\" said Helen.","The illegal planeload o' pollutants hasn't landed at Chicago's O'Hare.","She'll call Allison in Honolulu, not a local call, on her cellular phone."],
["This'll enthrall the linguists...using the letter \"L,\" one can spell","\"chocolate.\"","Allegra, an unparalleled intellectual, calculated the celestial latitudes and","longitudes in her sleep."],
["ffff yyyy ffff yyyy ffff yyyy ffff yyyy","ffff yyyy ffff yyyy ffff yyyy ffff yyyy","fy fy fy fy","yf yf yf yf","ffff gggg hhhh yyyy pppp uuuu","guy guy guy guy gyp gyp gyp gyp","UHF UHF UHF UHF yuh yuh yuh yuh","huff huff huff huff","puff puff puff puff","puffy puffy puffy puffy puppy puppy puppy puppy"],
["aaaa cccc dddd eeee ffff gggg hhhh iiii llll nnnn","oooo pppp rrrr ssss tttt uuuu yyyy '''' ,,,, ....","aaaa cccc dddd eeee ffff gggg hhhh iiii llll nnnn","oooo pppp rrrr ssss tttt uuuu yyyy '''' ,,,, ...."],
["In Lafayette, crayfish and coffee intensify the lifestyle.","\"I defy you,\" cried Finley, \"to find a falcon as feathery as Godfrey.\"","Granny Fay left Cindy a frilly, yet unfortunately frayed, taffeta dress.","In days of yesteryear, typography did not signify only fonts and typefaces."],
["The youthful fantasy of Goofy and Donald left Francine the fallacy that life is","often funny.","\"After the fifteenth forfeiture,\" uttered the referee, \"Stanford is,","officially, ineffectual.\"","Dreyfuss thought fondly of that hefty eyeful of San Francisco's fog, last","Friday near the ferry.","Geoffrey's faculty lecture on crystallography and diffraction patterns is","usually insufficient and faulty.","If you can differentiate psychotherapy and psychoanalysis, or psychiatry and","psychology, you yourself are a psychologist.","Yesterday, as they do each payday, Sydney and Clifford playfully ran off to","the fishery for frothy glasses of Henry's Draft Ale."],
["kkkk mmmm kkkk mmmm kkkk mmmm kkkk mmmm","kkkk mmmm kkkk mmmm kkkk mmmm kkkk mmmm","km km km km km km km km","mk mk mk mk mk mk mk mk","hhhh kkkk mmmm uuuu","ku ku ku ku","mu mu mu mu","UK UK UK UK","hum hum hum hum mum mum mum mum muk muk muk muk"],
["aaaa cccc dddd eeee ffff gggg hhhh iiii kkkk llll mmmm","nnnn oooo pppp rrrr ssss tttt uuuu yyyy '''' ,,,, ....","aaaa cccc dddd eeee ffff gggg hhhh iiii kkkk llll mmmm","nnnn oooo pppp rrrr ssss tttt uuuu yyyy '''' ,,,, ...."],
["Kramer asked for skim milk in a melodramatic manner.","\"My kingdom for a Macintosh,\" Maurice choked out meekly.","It's more sportsmanlike to say \"checkmate\" than \"knockout.\"","Emmet felt homesick until Mom sent him that Hallmark Hanukkah card.","The makeshift cloakroom is a trademark of McKinley's decisionmaking.","Kim's nickname is \"Kimono,\" an irksome mockery of her days in Yokohama."],
["There's not much homemade pumpkin ice cream and Smucker's hot fudge sauce","remaining.","The filmmaker, in machinelike precision, caught the magma and smoke from the","immense Mt. Krakatoa on film.","Stock in Amtrak skyrocketed after McKeon's remark mocking spokesmen,","gimmickery, and smokescreens in the marketplace.","From Katmandu to Oklahoma, from Stockholm to Kentucky, from Alaska to the","Kremlin, Kodak film is found in many, many cameras."],
["jjjj wwww jjjj wwww jjjj wwww jjjj wwww","jjjj wwww jjjj wwww jjjj wwww jjjj wwww","jw jw jw jw jw jw jw jw","wj wj wj wj wj wj wj wj","eeee jjjj tttt wwww","ewe ewe ewe ewe jet jet jet jet Jew Jew Jew Jew","wee wee wee wee wet wet wet wet","Jewett Jewett Jewett Jewett"],
["aaaa cccc dddd eeee ffff gggg hhhh iiii jjjj kkkk llll mmmm","nnnn oooo pppp rrrr ssss tttt uuuu wwww yyyy '''' ,,,, ....","aaaa cccc dddd eeee ffff gggg hhhh iiii jjjj kkkk llll mmmm","nnnn oooo pppp rrrr ssss tttt uuuu wwww yyyy '''' ,,,, ...."],
["Jamestown, New York, that's my home town.","The Joshua Tree National Monument is known worldwide.","Jujitsu makes you use your opponent's weight against himself.","\"Wow,\" he said as his jaw dropped. \"That's a jewel of a wristwatch.\"","Wanting the water to flow, Irwin twisted the faucet counterclockwise.","Woodrow Wilson's popularity went downward after the economic slowdown.","The old Jewish widow withdrew further, working with the wooden jigsaw.","Judy wondered if it was worthwhile to walk downtown to the Jewelry store.","I wonder if that Newsweek on the windowsill has the lowdown on Woolworths."],
["With awe, Jeremy awkwardly swallowed a whole slew of raisinettes as the","John Waters film started.","Wynonna Judd, after a whirlwind tour of the Midwest, waited at the","Waldorf Astoria for two weeks.","\"Your Majesty,\" wrote Marjorie, \"Nothing justifies prejudice. I can rejoice","only when there is justice.\"","The newsletter whitewashed reports of wiretapping in Congresswoman","Hollingsworth's jurisdiction.","\"Hallelujah,\" wailed the janitor as he jettisoned the typewriter out the","window. The projectile majestically landed at the junction of Jefferson and","Winslow streets, just jolting, not injuring, a jogging tourist."],
["qqqq vvvv qqqq vvvv qqqq vvvv qqqq vvvv","qqqq vvvv qqqq vvvv qqqq vvvv qqqq vvvv","qv qv qv qv qv qv qv qv","vq vq vq vq vq vq vq vq"],
["aaaa cccc dddd eeee ffff gggg hhhh iiii jjjj kkkk llll mmmm nnnn","oooo pppp qqqq rrrr ssss tttt uuuu vvvv wwww yyyy '''' ,,,, ....","aaaa cccc dddd eeee ffff gggg hhhh iiii jjjj kkkk llll mmmm nnnn","oooo pppp qqqq rrrr ssss tttt uuuu vvvv wwww yyyy '''' ,,,, ...."],
["Mercury and quicksilver are quite the same.","An acquisitive mind helped Pavlov evolve his theories.","QVC's involvement with Paramount may give it new verve.","Vivian's new Volvo unequivocally vanquished her fears of driving.","According to Pravda, Vladivostok was a quiet village in its Soviet days.","This unique, opaque liquor does not quench your thirst, it makes you queasy.","David's vivid imagination and his inquisitive and inventive mind suggest a high IQ."],
["If Iraq was equipped to invade and conquer Tel Aviv, the U.S. may have quashed","that pervasively.","We've never quantitatively proven that a quaver is equivalent to a quiver, only","qualitatively.","This revolutionary cardiovascular technique is representative of the","productivity here in Charlottesville.","\"I've never had such quality hors d'oeuvres,\" Javier said assertively over the","tranquil sounds of Vivaldi, as he looked over the picturesque headquarters of","the Vancouver Civic Center.","Nirvana's inequivalent sequel to their provocative release, Nevermind, is","inconclusive. Nevertheless, this quirky yet vivacious trio has evoked a","progressive sound that very well may give you a new perspective on irreverence."],
[";;;; zzzz ;;;; zzzz ;;;; zzzz ;;;; zzzz",";;;; zzzz ;;;; zzzz ;;;; zzzz ;;;; zzzz",";z ;z ;z ;z :z :z :z :z",";z ;z ;z ;z :z :z :z :z","Z; Z; Z; Z; z: z: z: z:"],
["aaaa cccc dddd eeee ffff gggg hhhh iiii jjjj kkkk llll mmmm nnnn oooo","pppp qqqq rrrr ssss tttt uuuu vvvv wwww yyyy zzzz '''' ,,,, .... ;;;;","aaaa cccc dddd eeee ffff gggg hhhh iiii jjjj kkkk llll mmmm nnnn oooo","pppp qqqq rrrr ssss tttt uuuu vvvv wwww yyyy zzzz '''' ,,,, .... ;;;;"],
["Zachary MacKenzie froze in amazement; on the radio in his Mazda he heard","pizzicato stanzas of Mozart.","Carmen Rodriguez is a citizen of Venezuela; her former spouse, Inigo Martinez,","and his new wife, Anna Vasquez, have moved to Swaziland or Tanzania.","The prizewinning paper on immunization against schizophrenia was delivered in","Czechoslovakia; this technique was deemphasized in Switzerland.","A crazed gazelle was whizzing around the zoo; a quizzical giraffe guzzled down","pizzas through his muzzle; another one merely grazed and dozed; several","chimpanzees started zigging and zagging; the reptile zone was oozing with","activity; several lizards hazarded the freezing waters and capsized the fish","tanks; a dozen grizzlies were waltzing in the plaza."],
["bbbb xxxx bbbb xxxx bbbb xxxx bbbb xxxx","bbbb xxxx bbbb xxxx bbbb xxxx bbbb xxxx","bx bx bx bx bx bx bx bx","xb xb xb xb xb xb xb xb"],
["aaaa bbbb cccc dddd eeee ffff gggg hhhh iiii jjjj kkkk llll mmmm nnnn oooo","pppp qqqq rrrr ssss tttt uuuu vvvv wwww xxxx yyyy zzzz '''' ,,,, .... ;;;;","aaaa bbbb cccc dddd eeee ffff gggg hhhh iiii jjjj kkkk llll mmmm nnnn oooo","pppp qqqq rrrr ssss tttt uuuu vvvv wwww xxxx yyyy zzzz '''' ,,,, .... ;;;;"],
["Heathcliff Huxtable was played by the inexorable Bill Cosby.","An inexhaustible supply of benzedrine merely exacerbated his disturbances.","Bruce Boxleitner explained to the extraterrestrial why Babylon Five was built."],
["The ambidextrous exhibitor was exhausted by the time he loaded the boxcar","with hobbyhorses.","Drop those xeroxes off in the mailbox; I'll get them in the bibliography in","five days maximum.","Mr. Balboa is pretty flexible with the textbook; it's probably excusable to","fall a bit behind.","Why Mr. Baxter went from Bordeaux to the tableaux exhibit in Luxembourg by","taxicab is inexplicable.","Becky found the Bronx pretty obnoxious; though there was that Caribbean","restaurant that truly excelled.","The executives at NBC, CBS, and ABC all found it inexcusable that the BBC was","so inflexible and xenophobic.","An exuberant Bill Clinton blew into his saxophone before the ambassadors; it","was an extraordinary experience that nobody could explain."]]
}

	var randomQuotes = ["Are you an American Gangster?", "Back off man, I'm a scientist.", "I love the smell of napalm in the morning.", "Your mother ate my dog!"];
	var dumpQuotes = [];

	var scores = {};

	function updateScores() {
		wpm = calculateWPM(testTimer.getRawTime());
		if (typeof scores[testType] == "undefined"){
			scores[testType] = [];
			log("scores",scores[testType]);
		}
		scores[testType][curLesson] = {
			"keystrokes" : kCount,
			"mistakes" : mCount,
			"wpm" : wpm
		};
		log(scores);
		stats.setScore(testType, scores[testType]);
	}
	
	function getRandomTest(){
		testType = "RANDOM";
		if (randomQuotes.length < 1) {
			randomQuotes = dumpQuotes;
			dumpQuotes = [];
		}
		var testNum = Math.floor(Math.random()* randomQuotes.length);
		var quote = randomQuotes.splice([testNum],1);
		dumpQuotes.push(quote[0]);
		return quote[0];
	}
	
	function updateTestResults(){
		$("#keystrokeUpdater").html(kCount);
		$("#mistakeUpdater").html(mCount);			
		var accuracy = (kCount) ? Math.round(100-(mCount/kCount*100)) + "%" : "~";
		$("#accuracyUpdater").html(accuracy);
		wpm = (!isTestInitialized) ? calculateWPM(testTimer.getRawTime()) : "~";
		$("#wpmUpdater").html(wpm);
	}
		
	function updateTestString(){
		var first = testString.substring(0, sCount);
		var curChar = testString.charAt(sCount);
		var last = testString.substring(sCount + 1, testString.length);
		var fullString = '<span class="testString">%s<span class="curChar">%s</span><span class="charRemainder">%s</span></span>';
		fullString = fullString.format(first, curChar, last);
		$("#testString,#resultString").html(fullString);
	}

	function updateTestStage(){
		if (lessonIndex != null){
			var thisLesson = lessons[keyboardType][curLesson];
			var $testStage = $("#testStage");
			if (lessonIndex == 0) {
				var markers = [];
				for (i = 0; i < thisLesson.length; i++) {
					markers[i] = "<span>&#149</span>"; // add bullets
				}
				$testStage.html(markers.join("&nbsp;"));
			}
			else if(lessonIndex == thisLesson.length) {
				var totalLessons = lessons[keyboardType].length - 1;
				//$testStage.html('<span class="curLesson">&#10003</span>');
				/*
				if (curLesson > 0) {
					$testStage.prepend('<a id="prevLesson" class="%s">&#171 Last Lesson </a>'.format(curLesson - 1));
				}
				*/
				if (curLesson < totalLessons) {
					$testStage.html('<a id="nextLesson" class="%s"></a>'.format(parseInt(curLesson) + 1));
				}
			}
			$testStage.children("span").removeClass("curLesson")
				.eq(lessonIndex).addClass("curLesson");
		}
	}
	
	function endTest(){
		$("#testString").add("#resultString").add(".result").addClass("finished");
	}
	
	function calculateWPM(rawTime){
		var wAmt = wCount;
		wAmt = Math.round(wAmt/rawTime*100000);
		wAmt = Math.round(60*wAmt/100);
		return wAmt;
	}

	function resetTestTimer(){
		testTimer.pause();
		testTimer.reset();
		testTimer.setTimerResults();

	}
	return {
 		init : function(){
			if($("#testScreen").is(":visible"))
			{
				isTestInitialized = true;
				//keyboardType = $("#keyType").val();
				this.reset();
				updateTestString();
				updateTestStage();
				updateTestResults();
				$("#mainContainer .lessonId").hide();
				$("#testStatus").show().html("<span>%s</span><a></a>".format(ts.resources.start));
				$("#testString").show().add("#resultString").add(".result").removeClass("finished");
				$("#testStage").show();
				$("#accuracyLabel").add("#wpmLabel").addClass("disabled");
			}
		},
		
		// not currently used!
		start : function(){
			isTestStarted = true;			
		},

		// not currently used!		
		pause : function(){
			
		},
		
		stop : function(){
			this.reset();
			$("#mainContainer .lessonId").show();
			$(".testString").add("#testStage").hide();
			$("#testStatus").html("<span>%s</span><a></a>".format(ts.resources.select));
		},
		
		reset : function(){
				isTestStarted = false;
				sCount = 0; 
				kCount = 0;
				mCount = 0;
				wCount = 0;			
				resetTestTimer();
		},
 		
		update : function(charInput, keyClass){
			if (!isTestStarted) {
				isTestStarted = true;
				$("#testStatus").html(ts.resources.inProgress);
				testTimer.start();
			}
			kCount++;
			
			if (kCount > 0) {
				$("#accuracyLabel").removeClass("disabled");
			}
			
			if (charInput == testString.charAt(sCount)) { // correct key
				$(keyClass).add(".curChar").addClass("rightKey");
				sCount++;
				updateTestString();
			}
			else { // wrong key
				$(keyClass).add(".curChar").addClass("wrongKey");
				mCount++;
				cursor.pause();
			}
			if (testString.length == sCount) { // successful finish
				wCount += testString.split(" ").length;
				var lesson = lessons[keyboardType][curLesson];
				if (lessonIndex != null && lessonIndex < lesson.length - 1){
					sCount = 0;
					lessonIndex++;
					
					testString = lesson[lessonIndex];
					updateTestString();
				}
				else {
					lessonIndex++;
					testTimer.pause();
					endTest();
					$("#testStatus").html(ts.resources.finished);
					$("#wpmLabel").removeClass("disabled");
					isTestInitialized = false;
					isTestStarted = false;
					updateScores();
				}
				updateTestStage();

			}
			updateTestResults();
		},
		
		cleanUp : function(){
			$(".rightKey").add(".curChar").removeClass("rightKey");
			$(".wrongKey").add(".curChar").removeClass("wrongKey");
			$(".curChar").addClass("cursorBlink");
			cursor.start();
		},
		
		randomTest : function(){
			testString = getRandomTest();
			lessonIndex = null;
		},
		
		setTest : function(keyboard, lesson){
			keyboardType = keyboard;
			testType = keyboardType;
			curLesson = lesson;
			lessonIndex = 0;
			testString = lessons[keyboard][lesson][0];
		},
		
		getLessons : function(){
			return lessons;
		},
		
		getScores : function(){
			return scores;
		},
		
		loadScores : function(scoreObj){
			scores = scoreObj;
			log(scores);
		},
		clearScores : function(){
			scores = {
				"QWERTY" : [],
				"DVORAK" : [],
				"RANDOM" : []
			};	
			stats.clearScore();
			return scores;
		},
		getKeyType: function(){
			return keyboardType;
		},
		setKeyType: function(keyType){
			keyboardType = keyType;
			settings.setVal("KEYBOARD", keyType);
			log(keyboardType);
		},
		isInitialized : function(){
			return isTestInitialized;
		}
	}
};

