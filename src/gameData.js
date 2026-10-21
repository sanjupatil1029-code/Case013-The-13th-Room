// CASE 013: THE 13TH ROOM - Complete Narrative, Suspects, 3-Layer Evidence, Deductions & Endings

export const suspectsData = [
  {
    id: 'vikram',
    name: 'Thakur Vikram Singh Rathore',
    title: 'The Family Patriarch',
    image: '/assets/suspect_vikram.jpg',
    age: 'Deceased (Head of Family in 1998)',
    status: 'Deceased',
    overview: 'The head of the Rathore family in 1998. He claimed Meera had become unstable and left voluntarily. He ordered the eastern corridor sealed and paid to have the original architectural plans replaced.',
    motive: "Protect the family's reputation and conceal a decades-old secret.",
    suspiciousEvidence: 'A signed renovation order dated 14 July 1998, authorizing masonry work at 3:00 AM.',
    secret: 'He knew the thirteenth chamber existed, but he insisted that it had been empty for generations.',
    contradictionClue: 'clue_07',
    interrogation: [
      { speaker: 'Thakur Vikram (1998)', text: 'Meera was unstable... she ran away into the desert storm. That eastern corridor had structural decay; I had it sealed to protect this household.' },
      { speaker: 'Investigator (2026)', text: 'If she ran away at 2:13 AM, why did you have a masonry crew arrive with quick-setting mortar at 3:00 AM?' },
      { speaker: 'Thakur Vikram (Reconstructed)', text: 'The thirteenth chamber was never meant to be opened by anyone. You should have let it sleep.' }
    ]
  },
  {
    id: 'kamla',
    name: 'Kamla Bai',
    title: 'The Former Housekeeper',
    image: '/assets/suspect_kamla.jpg',
    age: '72 (Alive)',
    status: 'Living in adjacent village',
    overview: 'Kamla worked at the haveli for thirty years. She was the last person known to have spoken to Meera. She now claims the house changes its layout when it rains.',
    motive: 'She may be protecting someone she loved.',
    suspiciousEvidence: 'Her fingerprints appear on a brass key supposedly destroyed in 1998.',
    secret: 'She helped Meera prepare to leave the haveli, but the escape never happened as planned.',
    contradictionClue: 'clue_08',
    interrogation: [
      { speaker: 'Kamla Bai', text: 'The haveli changes when the rain comes down hard... walls move, doors that were there at dusk vanish by midnight. Meera heard footsteps where there were no rooms.' },
      { speaker: 'Investigator', text: 'The police recorded that the brass key to the eastern wing was destroyed. Why are your fresh prints all over it?' },
      { speaker: 'Kamla Bai', text: 'I unlocked the door for Meera that night! She was supposed to run... but she went in, and the 13th bell rang. When I ran to pull her back, the keyhole was cold stone.' }
    ]
  },
  {
    id: 'arvind',
    name: 'Arvind Joshi',
    title: 'The Architectural Historian',
    image: '/assets/suspect_arvind.jpg',
    age: '58 (Alive)',
    status: 'Retired from ASI',
    overview: 'Arvind was hired to document the haveli before its restoration. He discovered that the foundation measurements did not match the recorded floor plan, then resigned without explanation.',
    motive: 'His research could expose fraud involving the property and its history.',
    suspiciousEvidence: 'His measurements show a narrow space behind the eastern wall, yet he denies ever entering it.',
    secret: 'He found evidence of a concealed chamber before the current investigation began and removed one page from his report.',
    contradictionClue: 'clue_09',
    interrogation: [
      { speaker: 'Arvind Joshi', text: 'The family archives claimed twelve rooms. But when I measured the perimeter exterior vs the interior rooms, there was a 1.4-meter cavity running behind the prayer wing.' },
      { speaker: 'Investigator', text: 'Why did you tear page 7 out of your architectural survey and flee Rajasthan?' },
      { speaker: 'Arvind Joshi', text: 'Because I tapped that wall with a geophone! There was a furnished chamber inside, and something on the other side knocked back three times.' }
    ]
  },
  {
    id: 'devendra',
    name: 'Inspector Devendra Rathore',
    title: 'The Retired Investigator',
    image: '/assets/suspect_devendra.jpg',
    age: '74 (Alive)',
    status: 'Former Rajasthan Police Officer',
    overview: 'Devendra led the original missing-person investigation. His final report concluded that Meera had left voluntarily, despite several inconsistencies.',
    motive: 'Preserve his reputation and prevent scrutiny of the original investigation.',
    suspiciousEvidence: 'His report contains a timestamp from 2:13 AM, but the station register says he arrived at 3:40 AM.',
    secret: 'He was ordered to remove a witness statement from the case file. He complied, but kept a carbon copy.',
    contradictionClue: 'clue_04',
    interrogation: [
      { speaker: 'Inspector Devendra', text: 'It was a textbook runaway case. 17-year-old girl, family tensions, thunderstorm. No signs of struggle. We closed it by protocol.' },
      { speaker: 'Investigator', text: 'The precinct dispatch log shows you did not leave the station until 3:40 AM. Why does your handwritten report timestamp your arrival at the haveli at 2:13 AM?' },
      { speaker: 'Inspector Devendra', text: 'The Thakur called me before the girl went missing! He told me what time to write down. And I kept the mason’s statement in my strongbox because I knew one day someone like you would come asking.' }
    ]
  },
  {
    id: 'naina',
    name: 'Naina Rathore',
    title: 'The Last Descendant',
    image: '/assets/suspect_naina.jpg',
    age: '29 (Alive)',
    status: 'Meera’s Niece / Client',
    overview: 'Naina is Meera’s niece and the person who anonymously sent the cassette. She claims she has never visited the haveli, but she knows details about its internal layout.',
    motive: 'Find out what happened to her aunt and recover a missing family document.',
    suspiciousEvidence: 'The cassette was recorded on a machine manufactured years after Meera disappeared.',
    secret: 'Naina created the recording from an old tape, but the final thirteen knocks were not on the original. The question: If Naina added the knocks, who—or what—made them in the room where she recorded it?',
    contradictionClue: 'clue_05',
    interrogation: [
      { speaker: 'Naina Rathore', text: 'I sent you the tape because nobody else believed me. My family acts like Aunt Meera never existed. Twelve rooms... but she told my mother there was a thirteenth.' },
      { speaker: 'Investigator', text: 'Forensic audio analysis shows the tape was recorded on a modern recorder, and the knocks were spliced in. Did you fake the recording?' },
      { speaker: 'Naina Rathore', text: 'I transferred Aunt Meera’s real 1998 whisper from a degrading reel! But the 13 knocks... I didn’t add them digitally. While I was recording in my Jaipur apartment at 2:13 AM, something started pounding on my wall from the outside!' }
    ]
  }
];

export const haveliRooms = [
  { id: 'room_01', num: 1, name: 'Grand Entrance Pol', floor: 'Ground Floor', desc: 'The massive fortified studded teak gatehouse of the Rathore dynasty.' },
  { id: 'room_02', num: 2, name: 'Central Aangan Courtyard', floor: 'Ground Floor', desc: 'The open-sky sandstone atrium with 8 colonnade pillars, grand chandelier, and rain puddles.' },
  { id: 'room_03', num: 3, name: 'Diwan-e-Aam (Reception)', floor: 'Ground Floor', desc: 'Public reception hall where the grandfather clock stopped at 2:13 AM.' },
  { id: 'room_04', num: 4, name: "Thakur Vikram's Study", floor: 'Ground Floor', desc: 'Private sanctuary where the midnight renovation order was sealed.' },
  { id: 'room_05', num: 5, name: "Kamla Bai's Quarters", floor: 'Ground Floor', desc: 'The housekeeper chamber containing the mortar-stained brass key.' },
  { id: 'room_06', num: 6, name: 'Grand Staircase & Gallery', floor: 'Ground Floor / Stairway', desc: 'Wide sandstone stairs displaying the 1998 Rathore Ancestral Portrait.' },
  { id: 'room_07', num: 7, name: "Arvind's Drafting Studio", floor: 'Second Floor', desc: 'Architectural studio where the 1.4-meter structural void was drafted.' },
  { id: 'room_08', num: 8, name: '1998 Police Desk', floor: 'Second Floor', desc: 'Inspector Devendra’s staged post holding Mason Ramu’s screaming report.' },
  { id: 'room_09', num: 9, name: 'Family Mandir & Shrine', floor: 'Second Floor', desc: 'Sacred marble altar housing the 13th bell hook and 1963 child talisman.' },
  { id: 'room_10', num: 10, name: "Meera's Bedchamber", floor: 'Second Floor', desc: 'The vanished girl’s room with the glistening wet-ink diary.' },
  { id: 'room_11', num: 11, name: 'Royal Toshakhana (Armory)', floor: 'Second Floor', desc: 'Ancestral armory and treasury holding antique Rajput swords and shields.' },
  { id: 'room_12', num: 12, name: 'Upper Jharokha Terrace', floor: 'Second Floor', desc: 'Wind pavilion overlooking the stormy Thar desert.' },
  { id: 'room_13', num: 13, name: 'THE THIRTEENTH ROOM', floor: 'Second Floor (Eastern Wing)', desc: 'The cursed chamber sealed by ancient Tantric magic and blood mandala.' }
];

export const cluesData = [
  {
    id: 'clue_05',
    leadIndex: 1,
    name: 'The Spliced Cassette & Child’s Whisper',
    room: 'Room 1: Grand Entrance Pol',
    floor: 'Ground Floor',
    icon: '📼',
    physical: 'A TDK 60-minute microcassette labeled "Rathore - July 98" resting on an antique carved chowki at the entrance gate. A microscopic splice tape joins two distinct magnetic reels.',
    documentary: 'Naina admitted splicing modern knocking sounds to provoke an investigation.',
    paranormal: 'Demodulating the audio track below 150 Hz isolates a faint, terrified child’s voice whispering: "Anand... 1963... the room won’t let us leave."',
    unlocked: false,
    pairedWith: 'clue_11',
    deductionId: 'ded_05',
    unlocksLead: 2,
    leadHint: 'A dispatch note beside the recorder states: "All clocks froze at 2:13 AM. Proceed to Room 3: Diwan-e-Aam."'
  },
  {
    id: 'clue_01',
    leadIndex: 2,
    name: 'The 2:13 Stopped Clock',
    room: 'Room 3: Diwan-e-Aam',
    floor: 'Ground Floor',
    icon: '🕰️',
    physical: 'An antique mahogany grandfather clock frozen at precisely 2:13 AM in the Diwan-e-Aam reception hall. The brass bezel shows fresh micro-scratches near the rear winding arbor.',
    documentary: 'Police report claims all clocks in the haveli stopped simultaneously due to a lightning power surge during the storm.',
    paranormal: 'When illuminated with the kerosene lantern, the pendulum casts two separate shadows, and the brass hands twitch backwards.',
    unlocked: false,
    pairedWith: 'clue_07',
    deductionId: 'ded_01',
    unlocksLead: 3,
    leadHint: 'A slip behind the clock dial reveals: "Thakur Vikram locked the emergency order in Room 4: Private Study."'
  },
  {
    id: 'clue_07',
    leadIndex: 3,
    name: 'The 3:00 AM Renovation Order',
    room: "Room 4: Thakur's Study",
    floor: 'Ground Floor',
    icon: '📜',
    physical: 'An official requisition voucher stamped with Thakur Vikram’s seal on the teak study desk, ordering 40 bags of quick-drying cement.',
    documentary: 'Timestamped 14 July 1998 at 03:00 AM—less than 45 minutes after Meera vanished.',
    paranormal: 'The red wax seal remains warm, as if freshly pressed minutes ago.',
    unlocked: false,
    pairedWith: 'clue_01',
    deductionId: 'ded_01',
    unlocksLead: 4,
    leadHint: 'Margin notes show: "Kamla Bai took the master key. Check Room 5: Housekeeper Quarters in the southwest corner."'
  },
  {
    id: 'clue_08',
    leadIndex: 4,
    name: 'The Brass Key with Housekeeper Prints',
    room: "Room 5: Kamla Bai's Quarters",
    floor: 'Ground Floor',
    icon: '🔑',
    physical: 'A heavy ornamental brass key forged in traditional Rajput filigree atop the copper chest in Kamla’s quarters, stained with dried lime powder.',
    documentary: 'Police evidence manifest #42 states this key was incinerated with household trash.',
    paranormal: 'When held in the palm facing the eastern wall, the key vibrates with the rhythm of a human heartbeat.',
    unlocked: false,
    pairedWith: 'clue_02',
    deductionId: 'ded_04',
    unlocksLead: 5,
    leadHint: 'Kamla’s ledger notes: "Meera ran to Room 6: Grand Staircase before the 13th bell struck. The portrait saw everything."'
  },
  {
    id: 'clue_06',
    leadIndex: 5,
    name: 'The Extra Figure in the Portrait',
    room: 'Room 6: Grand Staircase Gallery',
    floor: 'Ground Floor / Stairway',
    icon: '🖼️',
    image: '/assets/rathore_family_portrait.jpg',
    physical: 'A formal 1998 post-disappearance ancestral portrait of the Rathore family mounted in an antique carved Jharokha frame at the top of the grand staircase.',
    documentary: 'The estate invoice notes only 4 elders were present for the sitting after Meera disappeared. An empty chair was arranged for the missing girl.',
    paranormal: 'Under polaroid photographic exposure, a pale child with hollow eyes appears standing directly behind the empty chair left for Meera, pointing upstairs!',
    unlocked: false,
    pairedWith: 'clue_13',
    deductionId: 'ded_06',
    unlocksLead: 6,
    leadHint: 'The child points up the staircase to Floor 2! Search Room 7: Architect Arvind Joshi’s studio in the Northeast Wing.'
  },
  {
    id: 'clue_03',
    leadIndex: 6,
    name: 'The Impossible Floor Plan',
    room: "Room 7: Arvind's Drafting Studio",
    floor: 'Second Floor',
    icon: '📐',
    physical: 'Architectural blueprint drafted on linen vellum on Arvind’s drafting table. The eastern corridor is drawn as a single solid sandstone wall.',
    documentary: 'An 1860 construction invoice refers to "The Thirteenth Chamber for the Unspoken".',
    paranormal: 'Laser and tape measurements prove the exterior corridor is 1.4 meters wider than the interior measurements allow.',
    unlocked: false,
    pairedWith: 'clue_09',
    deductionId: 'ded_03',
    unlocksLead: 7,
    leadHint: 'Arvind’s note reveals: "Inspector Devendra confiscated the mason’s statement. Check Room 8: Police Desk across the balcony."'
  },
  {
    id: 'clue_09',
    leadIndex: 6,
    name: 'Arvind Joshi’s Torn Page 7',
    room: "Room 7: Arvind's Drafting Studio",
    floor: 'Second Floor',
    icon: '📝',
    physical: 'A crumpled grid sheet with trigonometric calculations and cross-sectional elevation lines beside the blueprints.',
    documentary: 'Arvind notes: "Acoustic void detected behind east corridor. Wall resonates between 40Hz and 60Hz. It is hollow."',
    paranormal: 'Handwritten scrawl in the margin reads: "The wall breathes when the 13th bell strikes. God forgive this house."',
    unlocked: false,
    pairedWith: 'clue_03',
    deductionId: 'ded_03'
  },
  {
    id: 'clue_04',
    leadIndex: 7,
    name: 'The Missing Carbon Statement',
    room: 'Room 8: 1998 Police Desk',
    floor: 'Second Floor',
    icon: '📄',
    physical: 'A yellowed carbon-copy sheet stamped with the Rajasthan Police insignia, folded inside an unaddressed envelope on the typewriter desk.',
    documentary: 'Statement of mason Ramu: "At 4:15 AM on 14 July 1998, as we laid the final bricks of the eastern wall, a girl was screaming on the other side. The Thakur held a rifle and ordered us to finish."',
    paranormal: 'The paper is perpetually cold, and touching it causes the ambient sound of rain to amplify violently.',
    unlocked: false,
    pairedWith: 'clue_01',
    deductionId: 'ded_02',
    unlocksLead: 8,
    leadHint: 'The mason swears the Thakur placed the 1963 Child Talisman inside Room 9: Family Mandir. Head to the Mandir & Shrine.'
  },
  {
    id: 'clue_10',
    leadIndex: 8,
    name: 'The 13th Courtyard Bell Bracket',
    room: 'Room 9: Family Mandir & Shrine',
    floor: 'Second Floor',
    icon: '🔔',
    physical: '12 heavy bronze bells hang in the upper arcade. A 13th iron hook hangs empty over the eastern archway.',
    documentary: 'Servant oral histories report that a 13th bell was forged in 1963 for an unacknowledged newborn child.',
    paranormal: 'At precisely 2:13 AM, the empty hook swings violently as a phantom chime resonates throughout the stone arches.',
    unlocked: false,
    pairedWith: 'clue_05',
    deductionId: 'ded_05'
  },
  {
    id: 'clue_11',
    leadIndex: 8,
    name: 'The 1963 Erased Child’s Talisman',
    room: 'Room 9: Family Mandir & Shrine',
    floor: 'Second Floor',
    icon: '🏵️',
    physical: 'An antique copper and gold talisman inscribed with an auspicious child birth horoscope for 13 July 1963 on the marble altar.',
    documentary: 'The Rathore family genealogy parchment has an intentional acid erasure over the name "Anand Singh Rathore".',
    paranormal: 'Equipping the talisman silences the monsoon rain outside, plunging the haveli into unnatural stillness.',
    unlocked: false,
    pairedWith: 'clue_05',
    deductionId: 'ded_05',
    unlocksLead: 9,
    leadHint: 'The Mandir door unlocks Room 10: Meera’s private bedchamber down the north corridor!'
  },
  {
    id: 'clue_02',
    leadIndex: 9,
    name: "Meera's Diary & The Pictorial Tantric Spell",
    room: "Room 10: Meera's Bedchamber",
    floor: 'Second Floor',
    icon: '📖',
    physical: 'A calfskin diary with silver Rathore filigree on Meera’s dressing table. Pages from July 1 to 13 are written in neat Hindi cursive, ending in an illustrated pictorial mandala.',
    documentary: 'The family told investigators that Meera ceased keeping a diary two weeks before running away.',
    paranormal: 'Turn to the final page: written in glistening, fresh black ink is an entry describing you standing in this room, accompanied by an illustrated pictorial Tantric spell to break the Blood Seal: Agni 🔥 → Vayu 💨 → Jala 🌊 → Prithvi 🪨 → Key Strike 🗝️.',
    unlocked: false,
    pairedWith: 'clue_08',
    deductionId: 'ded_04',
    unlocksLead: 10,
    leadHint: 'The diary illustrates how Room 13 is sealed behind an ancient Tantric Blood Mandala in the eastern corridor. Perform the 4-rune ritual to shatter the barrier!'
  },
  {
    id: 'clue_12',
    leadIndex: 10,
    name: 'Fresh Wall Inscription',
    room: 'Eastern Magic Corridor',
    floor: 'Second Floor',
    icon: '✍️',
    physical: 'Charcoal and powdered brick writing directly beneath an ancestral Sanskrit prayer: "CASE 013 IS OPEN".',
    documentary: 'Photos from the 1998 police file show bare decaying plaster with no inscription.',
    paranormal: 'The charcoal is still moist. If brushed, faint red dust floats into the air forming the numerals "2:13".',
    unlocked: false,
    pairedWith: 'clue_06',
    deductionId: 'ded_06'
  },
  {
    id: 'clue_13',
    leadIndex: 10,
    name: "The 1998 Rathore Confession Book (The Accusation Details)",
    room: 'Room 13: THE THIRTEENTH ROOM',
    floor: 'Second Floor',
    icon: '📖',
    physical: 'A heavy leather-bound confession book with brass corners resting on the black stone altar inside Room 13. Folios 13 and 14 contain cryptic timestamps, poison notes, and contradictory witness logs.',
    documentary: 'Authored in 1998: details the premeditated murder of Meera, the Datura paralysis at 02:10 AM, and the ₹50,000 bribe paid to Inspector Devendra to bury Mason Ramu\'s statement.',
    paranormal: 'Tapping the cipher text causes the dried ink to glow crimson, revealing the hidden connections needed to accuse the perpetrator.',
    unlocked: false,
    pairedWith: 'clue_07',
    deductionId: 'ded_06',
    unlocksLead: 11,
    leadHint: 'The Confession Book contains the accusation details! Open your Evidence Board [TAB] and connect the red line to the 3:00 AM Masonry Order (#07) or Mason\'s Statement (#04) to expose the killer.'
  }
];

export const investigationSteps = [
  {
    step: 1,
    targetClueId: 'clue_05',
    title: 'The Entrance Pol Warning',
    room: 'Room 1: Grand Entrance Pol',
    floor: 'Ground Floor',
    objective: 'Search the entrance table near the fortified wooden gates for the microcassette recorder.',
    hint: 'Listen to the 1998 microcassette left on the carved chowki.',
    targetLocation: { x: 0, z: 16.5, y: 0 },
    unlocksRoomId: 'diwan_e_aam',
    leadResolution: 'The dispatch tape warns that all clocks halted at 2:13 AM on 13 July 1998. The heavy doors to Room 3: Diwan-e-Aam have unlocked!'
  },
  {
    step: 2,
    targetClueId: 'clue_01',
    title: 'The Frozen Clock',
    room: 'Room 3: Diwan-e-Aam',
    floor: 'Ground Floor',
    objective: 'Enter Room 3: Diwan-e-Aam and inspect the stopped 2:13 Grandfather Clock.',
    hint: 'Head North into the Diwan-e-Aam. Look for the glowing golden beacon on the grandfather clock.',
    targetLocation: { x: 0, z: -4.8, y: 0 },
    unlocksRoomId: 'thakur_study',
    leadResolution: 'A hidden requisition note behind the clock dial reveals Thakur Vikram signed an emergency masonry order in his private study.'
  },
  {
    step: 3,
    targetClueId: 'clue_07',
    title: 'The Midnight Masonry Order',
    room: "Room 4: Thakur's Study",
    floor: 'Ground Floor',
    objective: "Enter Room 4: Thakur's Study in the West Wing and inspect the 3:00 AM Renovation Order.",
    hint: 'Head West from the Diwan-e-Aam into the private study. Check the glowing document on the mahogany desk.',
    targetLocation: { x: -11.5, z: -1.0, y: 0 },
    unlocksRoomId: 'housekeeper_room',
    leadResolution: 'PLOT TWIST 1: Thakur Vikram ordered 40 bags of quick-setting cement at 3:00 AM—less than 45 minutes after Meera vanished! He noted Kamla Bai took the master key.'
  },
  {
    step: 4,
    targetClueId: 'clue_08',
    title: "Housekeeper Kamla's Brass Key",
    room: "Room 5: Kamla Bai's Quarters",
    floor: 'Ground Floor',
    objective: "Search Room 5: Kamla Bai's Quarters in the Southwest Wing for the missing Rajput brass key.",
    hint: 'Head South into Kamla’s chamber. Inspect the glowing key atop the antique trunk.',
    targetLocation: { x: -11.5, z: 10.0, y: 0 },
    unlocksRoomId: 'staircase_gallery',
    leadResolution: 'You found the mortar-stained brass key! Kamla notes Meera fled toward Room 6: Grand Staircase with her camera before the 13th bell struck.'
  },
  {
    step: 5,
    targetClueId: 'clue_06',
    title: 'The Ancestral Portrait & The Spectral Child',
    room: 'Room 6: Grand Central Staircase & Gallery',
    floor: 'Courtyard Stairway / Mezzanine',
    objective: 'Examine the 1998 Rathore Family Portrait mounted centrally at the top of the grand courtyard staircase.',
    hint: 'Walk straight up the grand central imperial staircase in the courtyard and inspect the portrait or take a Polaroid snapshot [C].',
    targetLocation: { x: 0, z: 2.5, y: 4.0 },
    unlocksRoomId: 'floor_2_architect',
    leadResolution: 'PLOT TWIST 2: A spectral child stands behind Meera’s empty chair, pointing down the upper gallery! The Second Floor wings are now open.'
  },
  {
    step: 6,
    targetClueId: 'clue_03',
    title: "The Architect's Impossible Blueprints",
    room: "Room 7: Arvind's Drafting Studio",
    floor: 'Second Floor',
    objective: "Search Room 7: Architect Arvind Joshi's Drafting Studio (Northeast Wing) on Floor 2.",
    hint: 'Climb the stairs to Floor 2 and enter the Northeast drafting office. Check the blueprints.',
    targetLocation: { x: 12.0, z: -1.0, y: 4.0 },
    unlocksRoomId: 'police_office',
    leadResolution: 'PLOT TWIST 3: Arvind proved the exterior perimeter is 1.4m wider than the interior rooms allow! Inspector Devendra confiscated the mason’s report.'
  },
  {
    step: 7,
    targetClueId: 'clue_04',
    title: "The Silenced Mason's Statement",
    room: 'Room 8: 1998 Police Desk',
    floor: 'Second Floor',
    objective: "Search Room 8: Police Investigation Desk in the Northwest Wing for suppressed witness records.",
    hint: 'Walk across the upper balcony to the Northwest room with the typewriter desk.',
    targetLocation: { x: -12.0, z: 10.0, y: 4.0 },
    unlocksRoomId: 'mandir_shrine',
    leadResolution: 'PLOT TWIST 4: Mason Ramu testified that Meera was alive and screaming behind the wall as they laid the mortar! Thakur Vikram entombed her with the 1963 Talisman.'
  },
  {
    step: 8,
    targetClueId: 'clue_11',
    title: "The 1963 Erased Child's Talisman",
    room: 'Room 9: Family Mandir & Shrine',
    floor: 'Second Floor',
    objective: 'Enter Room 9: Family Mandir in the West Wing to retrieve the 1963 Child Talisman.',
    hint: 'Head West into the Mandir. Inspect the marble altar beneath the phantom 13th bell.',
    targetLocation: { x: -12.0, z: -1.5, y: 4.0 },
    unlocksRoomId: 'meera_chamber',
    leadResolution: 'PLOT TWIST 5: The erased child was Anand Singh Rathore. The haveli was built in 1720 to sacrifice a royal child every 35 years! Meera’s bedchamber unlocks.'
  },
  {
    step: 9,
    targetClueId: 'clue_02',
    title: "Meera's Diary & The Pictorial Tantric Spell",
    room: "Room 10: Meera's Bedchamber",
    floor: 'Second Floor',
    objective: "Enter Room 10: Meera's Bedchamber in the North Wing and examine her diary on the dressing table.",
    hint: 'Walk North into Meera\'s private room. Inspect the diary on the carved dressing vanity table.',
    targetLocation: { x: 0, z: -12.9, y: 4.0 },
    unlocksRoomId: 'sealed_chamber',
    leadResolution: 'MEERA\'S DIARY RETRIEVED! Her journal reveals the pictorial Tantric unsealing spell: Agni 🔥 → Vayu 💨 → Jala 🌊 → Prithvi 🪨 → Kamla\'s Key Strike 🗝️ to shatter the Blood Seal of Room 13!'
  },
  {
    step: 10,
    targetClueId: 'clue_13',
    title: "The Blood Seal Shatter & The Accusation Details Book",
    room: 'Room 13: THE THIRTEENTH ROOM',
    floor: 'Second Floor (Eastern Wing)',
    objective: 'Approach the Glowing Tantric Magic Seal in the Eastern Corridor, execute the 4-Rune Unsealing Ritual to breach Room 13, and inspect the Confession Book on the sacred altar.',
    hint: 'Interact with the Blood Seal [E]. Align the four runes (Agni → Vayu → Jala → Prithvi) and strike the central bindu with Kamla\'s Key, then examine the book on the altar to uncover the accusation details!',
    targetLocation: { x: 12.0, z: -10.0, y: 4.0 },
    unlocksRoomId: null,
    leadResolution: 'THE BLOOD SEAL SHATTERS! You breach Room 13 and inspect the 1998 Confession Book containing the accusation details! Open the Evidence Board [TAB] and connect the red line between the clues to expose the killer!'
  }
];

export const deductionsData = [
  {
    id: 'ded_01',
    title: 'The Fabricated Flight',
    clueA: 'clue_01',
    clueB: 'clue_07',
    summary: 'Thakur Vikram ordered quick-setting cement at 3:00 AM—mere minutes after all clocks stopped at 2:13 AM. Meera never ran away; she was deliberately sealed behind the wall.',
    solved: false
  },
  {
    id: 'ded_02',
    title: 'The Silenced Witness',
    clueA: 'clue_04',
    clueB: 'clue_01',
    summary: 'Inspector Devendra confiscated the mason’s testimony to conceal cries heard from the wall at 4:15 AM, falsifying his arrival time to protect the family patriarch.',
    solved: false
  },
  {
    id: 'ded_03',
    title: 'The Architectural Concealment',
    clueA: 'clue_03',
    clueB: 'clue_09',
    summary: 'Arvind Joshi calculated a 1.4-meter structural void behind the eastern corridor. The 13th room is real, and Vikram threatened him to slice page 7 from the official record.',
    solved: false
  },
  {
    id: 'ded_04',
    title: 'The Housekeeper’s Secret Key',
    clueA: 'clue_02',
    clueB: 'clue_08',
    summary: 'Kamla Bai gave Meera the brass key so she could retrieve evidence and escape, but the 13th chamber locked from the inside when the 13th bell tolled.',
    solved: false
  },
  {
    id: 'ded_05',
    title: 'The 1963 Erased Child',
    clueA: 'clue_05',
    clueB: 'clue_11',
    summary: 'The haunting did not begin with Meera. In 1963, a child named Anand was erased from existence and entombed here. Meera found his record, triggering her disappearance.',
    solved: false
  },
  {
    id: 'ded_06',
    title: "The Killer Exposed: Thakur Vikram's Premeditated Murder",
    clueA: 'clue_07',
    clueB: 'clue_13',
    summary: 'Connecting the 1998 Confession Book with the 3:00 AM Masonry Order proves Thakur Vikram Singh Rathore murdered Meera by poisoning her with Datura and entombing her behind the masonry partition to conceal the family legacy of child sacrifices.',
    solved: false
  }
];

export const chaptersData = [
  {
    chapter: 1,
    title: 'The Gate That Closed',
    objective: 'Explore the Entrance Hall and retrieve the Haveli Floor Plan & First Recording.',
    hint: 'Inspect the ancestral portrait and the grandfather clock in the entrance hall.',
    cliffhanger: 'The iron courtyard gate slams shut behind you. Somewhere above, a bell rings—even though the courtyard bells remain motionless.'
  },
  {
    chapter: 2,
    title: 'Twelve Doors',
    objective: 'Investigate the Family Shrine and Eastern Corridor. Locate Meera’s diary and the stopped clocks.',
    hint: 'Use your kerosene lantern to examine the wall cracks in the eastern corridor.',
    cliffhanger: 'You turn back toward the corridor. A heavy wooden door stands where only solid lime plaster was five minutes ago.'
  },
  {
    chapter: 3,
    title: 'The Five Names',
    objective: 'Assemble the Evidence Board. Cross-reference witness statements and identify who ordered the corridor sealed.',
    hint: 'Open the Suspect Dossier (P) and compare Inspector Devendra’s log with Vikram’s renovation voucher.',
    cliffhanger: 'Demodulating the cassette reveals a name missing from the family tree: Anand, 1963.'
  },
  {
    chapter: 4,
    title: 'The Wall That Breathes',
    objective: 'Use Arvind’s measurements and the brass key to breach the 13th chamber.',
    hint: 'Bring your lantern close to the eastern wall until the hidden mandala pattern flares into view.',
    cliffhanger: 'The brass key clicks. The wall swings open to reveal a lit diya lamp and a diary with wet ink.'
  },
  {
    chapter: 5,
    title: '2:13 AM',
    objective: 'Uncover the original 1963 birth talisman and make your final decision on the case file.',
    hint: 'Check the desk in Room 13 and formulate all deductions on your Evidence Board.',
    cliffhanger: 'The clock strikes 2:13 AM. The door behind you vanishes. Choose your path.'
  }
];

export const endingsData = {
  A: {
    id: 'ending_a',
    code: 'Ending A',
    title: 'The Truth Is Recorded',
    condition: 'Solve at least 5 deductions, collect the 1963 Talisman, and choose to transmit the police evidence to the outside world.',
    narrative: `You upload the digitized police carbon copy, the architect's torn measurements, and the confession recording to your agency's satellite uplink. At dawn, the eastern wall crumbles into ordinary dust, releasing decades of trapped air. The Rajasthan authorities reopen Case 013, exposing the 1963 and 1998 atrocities committed by the Rathore patriarch.

As you step out through the haveli's iron gates, you inspect the final polaroid you took in the 13th room.

The shadowy child figure is no longer standing behind Meera's chair.
It is standing directly behind you in the photograph.`
  },
  B: {
    id: 'ending_b',
    code: 'Ending B',
    title: 'The Family Secret',
    condition: 'Confront Thakur Vikram’s legacy but choose to burn the paranormal evidence to protect Naina and Kamla.',
    narrative: `You recognize that releasing the full horror of the 13th room would destroy what little remains of the family. You hand the human criminal evidence to Naina privately and burn the supernatural records.

The historical murder is acknowledged in closed chambers, but the paranormal anomalies remain officially unrecorded.

A week later, you open your detective case file in Delhi. The evidence board, which held twelve photographs when you packed it, now contains thirteen.`
  },
  C: {
    id: 'ending_c',
    code: 'Ending C',
    title: 'The Thirteenth Entry',
    condition: 'Enter Room 13 without solving the deductions and follow the phantom voice blindly.',
    narrative: `You rush into the chamber without understanding the full conspiracy. The heavy brass door clicks shut behind you with a sound like a tomb closing.

You open Meera's diary on the desk. Beneath her last entry, new sentences are actively forming in wet black ink:
"He thought he was the investigator. But every person who opens the 13th room becomes part of the haveli's twelfth room."

In the present, your agency receives a package. Inside is your audio recorder and camera, recovered from the empty entrance hall.
The front cover of the agency case folder updates automatically:
CASE FILE 014 IS OPEN.`
  },
  SECRET: {
    id: 'ending_secret',
    code: 'Secret Ending',
    title: 'The Room Was Never Empty',
    condition: 'Discover all 13 Clues, solve all 6 Deductions, and listen to the demodulated audio track in Room 13.',
    narrative: `By connecting the 1963 talisman, the 1998 diary, and the 2026 audio cassette, you realize the impossible truth:

The Rathore family did not build the 13th room to hide Meera or Anand. The haveli was built around the room in 1720 to contain something ancient that requires a soul every generation. The family cover-up was merely human fear disguising a cosmic predator.

On your walkman, Meera's synthesized voice speaks with crystal clarity:
"If you can hear this, it has learned your name."

You turn toward the lantern light on the wall. Your body casts one shadow. Beside it, a second silhouette raises its hand and waves.
The clock stops at 2:13 AM. Screen cuts to black.`
  }
};
