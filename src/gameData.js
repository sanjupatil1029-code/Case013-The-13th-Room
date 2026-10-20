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

export const cluesData = [
  {
    id: 'clue_01',
    name: 'The 2:13 Stopped Clock',
    room: 'Eastern Corridor',
    icon: '🕰️',
    physical: 'An antique mahogany grandfather clock frozen at precisely 2:13. The brass bezel shows fresh micro-scratches near the rear winding arbor.',
    documentary: 'Police report claims all clocks in the haveli stopped simultaneously due to a lightning power surge during the storm.',
    paranormal: 'When illuminated with the kerosene lantern, the pendulum casts two separate shadows, and the brass hands twitch backwards.',
    unlocked: false,
    pairedWith: 'clue_07',
    deductionId: 'ded_01'
  },
  {
    id: 'clue_02',
    name: "Meera's Diary & The July 14 Entry",
    room: 'Family Shrine & Study',
    icon: '📖',
    physical: 'A calfskin diary with silver Rathore filigree. Pages from July 1 to 13 are written in neat Hindi cursive. The last entry was thought to end on July 13.',
    documentary: 'The family told investigators that Meera ceased keeping a diary two weeks before running away.',
    paranormal: 'Turn to the final page: written in glistening, fresh black ink is an entry dated 14 July 1998 describing you, the investigator, standing in this exact room holding the lamp.',
    unlocked: false,
    pairedWith: 'clue_08',
    deductionId: 'ded_04'
  },
  {
    id: 'clue_03',
    name: 'The Impossible Floor Plan',
    room: 'Archives Wing',
    icon: '📐',
    physical: 'Architectural blueprint drafted on linen vellum. The eastern corridor is drawn as a single solid 18-inch sandstone load-bearing wall.',
    documentary: 'An 1860 construction invoice refers to "The Thirteenth Chamber for the Unspoken".',
    paranormal: 'Laser and tape measurements prove the exterior corridor is 1.4 meters wider than the interior measurements allow.',
    unlocked: false,
    pairedWith: 'clue_09',
    deductionId: 'ded_03'
  },
  {
    id: 'clue_04',
    name: 'The Missing Carbon Statement',
    room: 'Maintenance Archives',
    icon: '📄',
    physical: 'A yellowed carbon-copy sheet stamped with the Rajasthan Police insignia, folded inside an unaddressed envelope.',
    documentary: 'Statement of mason Ramu: "At 4:15 AM on 14 July 1998, as we laid the final bricks of the eastern wall, a girl was screaming on the other side. The Thakur held a rifle and ordered us to finish."',
    paranormal: 'The paper is perpetually cold, and touching it causes the ambient sound of rain to amplify violently.',
    unlocked: false,
    pairedWith: 'clue_01',
    deductionId: 'ded_02'
  },
  {
    id: 'clue_05',
    name: 'The Spliced Cassette & Child’s Whisper',
    room: 'Entrance Hall Table',
    icon: '📼',
    physical: 'A TDK 60-minute microcassette labeled "Rathore - July 98". A microscopic splice tape joins two distinct magnetic reels.',
    documentary: 'Naina admitted splicing modern knocking sounds to provoke an investigation.',
    paranormal: 'Demodulating the audio track below 150 Hz isolates a faint, terrified child’s voice whispering: "Anand... 1963... the room won’t let us leave."',
    unlocked: false,
    pairedWith: 'clue_11',
    deductionId: 'ded_05'
  },
  {
    id: 'clue_06',
    name: 'The Extra Figure in the Portrait',
    room: 'Entrance Hall Jharokha',
    icon: '🖼️',
    image: '/assets/rathore_family_portrait.jpg',
    physical: 'A formal 1998 post-disappearance oil portrait of the Rathore elders seated in the haveli courtyard. Every elder looks rigid, staring directly ahead.',
    documentary: 'The estate invoice notes only 4 elders were present for the sitting after Meera disappeared. An empty chair was arranged for the missing girl.',
    paranormal: 'Under polaroid photographic exposure, a pale child with hollow eyes appears standing directly behind the empty chair left for Meera.',
    unlocked: false,
    pairedWith: 'clue_13',
    deductionId: 'ded_06'
  },
  {
    id: 'clue_07',
    name: 'The 3:00 AM Renovation Order',
    room: 'Thakur’s Desk',
    icon: '📜',
    physical: 'An official requisition voucher stamped with Thakur Vikram’s seal, ordering 40 bags of quick-drying cement.',
    documentary: 'Timestamped 14 July 1998 at 03:00 AM—less than 45 minutes after Meera vanished.',
    paranormal: 'The red wax seal remains warm, as if freshly pressed minutes ago.',
    unlocked: false,
    pairedWith: 'clue_01',
    deductionId: 'ded_01'
  },
  {
    id: 'clue_08',
    name: 'The Brass Key with Housekeeper Prints',
    room: 'Shrine Secret Alcove',
    icon: '🔑',
    physical: 'A heavy ornamental brass key forged in traditional Rajput filigree, stained with dried lime powder.',
    documentary: 'Police evidence manifest #42 states this key was incinerated with household trash.',
    paranormal: 'When held in the palm facing the eastern wall, the key vibrates with the rhythm of a human heartbeat.',
    unlocked: false,
    pairedWith: 'clue_02',
    deductionId: 'ded_04'
  },
  {
    id: 'clue_09',
    name: 'Arvind Joshi’s Torn Page 7',
    room: 'Surveyor’s Drafting Table',
    icon: '📝',
    physical: 'A crumpled grid sheet with trigonometric calculations and cross-sectional elevation lines.',
    documentary: 'Arvind notes: "Acoustic void detected behind east corridor. Wall resonates between 40Hz and 60Hz. It is hollow."',
    paranormal: 'Handwritten scrawl in the margin reads: "The wall breathes when the 13th bell strikes. God forgive this house."',
    unlocked: false,
    pairedWith: 'clue_03',
    deductionId: 'ded_03'
  },
  {
    id: 'clue_10',
    name: 'The 13th Courtyard Bell Bracket',
    room: 'Courtyard Archway',
    icon: '🔔',
    physical: '12 heavy bronze bells hang in the open courtyard. A 13th iron hook hangs empty over the eastern arch.',
    documentary: 'Servant oral histories report that a 13th bell was forged in 1963 for an unacknowledged newborn child.',
    paranormal: 'At precisely 2:13 AM, the empty hook swings violently as a phantom chime resonates throughout the stone arches.',
    unlocked: false,
    pairedWith: 'clue_05',
    deductionId: 'ded_05'
  },
  {
    id: 'clue_11',
    name: 'The 1963 Erased Child’s Talisman',
    room: 'Shrine Underfloor',
    icon: '🏵️',
    physical: 'An antique copper and gold talisman inscribed with an auspicious child birth horoscope for 13 July 1963.',
    documentary: 'The Rathore family genealogy parchment has an intentional acid erasure over the name "Anand Singh Rathore".',
    paranormal: 'Equipping the talisman silences the monsoon rain outside, plunging the haveli into unnatural stillness.',
    unlocked: false,
    pairedWith: 'clue_05',
    deductionId: 'ded_05'
  },
  {
    id: 'clue_12',
    name: 'Fresh Wall Inscription',
    room: 'Eastern Corridor Wall',
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
    name: 'The 13th Room Diya & Twin Shadows',
    room: 'The 13th Room',
    icon: '🪔',
    physical: 'A lit brass diya lamp resting on a colonial wooden desk surrounded by 1998 calendars and Meera’s audio recorder.',
    documentary: 'The room was sealed in 1998, yet the mustard oil inside the lamp has not evaporated after 28 years.',
    paranormal: 'The diya flame burns without smoke. Your shadow is cast on the opposite wall—accompanied by a second, taller silhouette.',
    unlocked: false,
    pairedWith: 'clue_06',
    deductionId: 'ded_06'
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
    title: 'The Temporal Anomaly',
    clueA: 'clue_06',
    clueB: 'clue_13',
    summary: 'The 13th room does not obey normal time. The figure in the portrait predates Meera and the investigator. The room reproduces July 14, 1998 indefinitely.',
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
