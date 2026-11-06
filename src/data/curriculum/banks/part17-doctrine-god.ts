import type { QuizQuestion } from '../../planQuizzes'
import { mc } from '../topics/_helpers'

export const PART17_GOD_BY_LESSON: Record<string, QuizQuestion[]> = {
  'god-existence-knowability': [
    mc('god-p17-1b1', 'In Exodus 3:14, God tells Moses his name is:', ['"I AM WHO I AM"', '"The Strong One"', '"Baal"', '"Adonai only"'], 0, 'The divine name emphasizes self-existence.', 'beginner'),
    mc('god-p17-1b2', 'According to John 17:3, eternal life is:', ['Knowing God and Jesus Christ', 'Being good', 'Having wealth', 'Church attendance'], 0, 'Eternal life is defined relationally.', 'beginner'),
    mc('god-p17-1i1', 'Can we know God truly?', ['Yes, though not exhaustively', 'No', 'Only through reason alone', 'Only mystics'], 0, 'Creatures know God truly but not fully.', 'intermediate'),
    mc('god-p17-1i2', '"Transcendence" means:', ['God is far above and distinct from creation', 'God is identical with nature', 'God is absent', 'God is a force'], 0, 'Transcendence highlights distinction from creation.', 'intermediate'),
    mc('god-p17-1a1', 'Why does Romans 11:33–36 matter here?', ['God’s ways are beyond us yet he is source, sustainer, and goal of all things', 'It denies knowledge of God', 'It is about election only', 'It is irrelevant'], 0, 'Paul balances mystery and true knowledge.', 'advanced'),
  ],
  'god-attributes': [
    mc('god-p17-2b1', '"Omniscient" means:', ['All-knowing', 'All-powerful', 'Everywhere present', 'Unchanging'], 0, 'Omniscience = complete knowledge.', 'beginner'),
    mc('god-p17-2b2', 'Which verse says God does not change?', ['Malachi 3:6', 'John 1:1', 'Genesis 1:1', 'Romans 3:23'], 0, 'Immutability is taught explicitly.', 'beginner'),
    mc('god-p17-2i1', 'Which is an incommunicable attribute?', ['Love', 'Aseity', 'Mercy', 'Wisdom'], 1, 'Aseity (self-existence) is not shared by creatures.', 'intermediate'),
    mc('god-p17-2i2', 'Which is a communicable attribute?', ['Omnipresence', 'Eternity', 'Holiness', 'Aseity'], 2, 'Holiness is reflected in creatures in a finite way.', 'intermediate'),
    mc('god-p17-2a1', 'Divine simplicity teaches that:', ['God is not composed of parts; his attributes are his one undivided being', 'God is easy to understand', 'God has few attributes', 'God is matter and spirit'], 0, 'Simplicity guards against dividing God’s essence.', 'advanced'),
  ],
  'god-trinity': [
    mc('god-p17-4b1', 'How many persons are in the Trinity?', ['One', 'Two', 'Three', 'Four'], 2, 'One God in three persons.', 'beginner'),
    mc('god-p17-4b2', 'Which verse commands baptism in the one name of Father, Son, and Spirit?', ['Matthew 28:19', 'John 3:16', 'Genesis 1:1', 'Romans 3:23'], 0, 'Triune baptism formula.', 'beginner'),
    mc('god-p17-4i1', 'Modalism teaches that:', ['One person appears in three modes', 'There are three gods', 'The Son is created', 'The Spirit is only a force'], 0, 'Modalism collapses persons into modes.', 'intermediate'),
    mc('god-p17-4i2', 'Acts 5:3–4 shows that:', ['The Holy Spirit is God', 'The Spirit is a force only', 'Peter lied', 'Ananias is God'], 0, 'Lying to the Spirit is lying to God.', 'intermediate'),
    mc('god-p17-4a1', 'The "economic Trinity" refers to:', ['The persons’ roles in redemptive history', 'God’s finances', 'The eternal being only', 'Creeds only'], 0, 'Economic = roles in salvation history.', 'advanced'),
  ],
  'god-sovereignty-providence': [
    mc('god-p17-3b1', 'Which attribute is repeated three times in Isaiah 6:3?', ['Holy', 'Love', 'Mighty', 'Wise'], 0, 'Holiness dominates the throne-room vision.', 'beginner'),
    mc('god-p17-3b2', '1 John 4:8 says God is:', ['Love', 'Law', 'Distant', 'Silent'], 0, 'God’s love is essential, not accidental.', 'beginner'),
    mc('god-p17-3i1', 'God’s wrath is:', ['His righteous opposition to sin', 'A bad mood', 'Cruelty', 'An error'], 0, 'Wrath is holy opposition to evil.', 'intermediate'),
    mc('god-p17-3i2', 'Romans 3:25–26 says God is both:', ['Just and the justifier of those who believe', 'Loving and unjust', 'Silent and active', 'Merciful and weak'], 0, 'The cross displays justice and justification together.', 'intermediate'),
    mc('god-p17-3a1', 'How does the cross show love and justice together?', ['God punished sin in Christ so he could forgive believers justly', 'Justice is ignored', 'Love is ignored', 'The cross is only symbolic'], 0, 'Propitiation satisfies wrath and opens mercy.', 'advanced'),
  ],
  'god-creation-relation': [
    mc('god-p17-5b1', 'Romans 8:28 says God works all things:', ['For the good of those who love him', 'For evil', 'Randomly', 'Only in heaven'], 0, 'Providence serves the elect’s good.', 'beginner'),
    mc('god-p17-5b2', 'Who meant evil for good in Genesis 50:20?', ['God', 'Joseph’s brothers only', 'Pharaoh', 'No one'], 0, 'God sovereignly overruled human evil.', 'beginner'),
    mc('god-p17-5i1', '"Providence" includes:', ['Preservation, concurrence, and government', 'Only miracles', 'Only prayer', 'Only creation'], 0, 'Classic threefold providence.', 'intermediate'),
    mc('god-p17-5i2', 'Acts 2:23 shows the cross was:', ['Both God’s plan and the sin of men', 'Only an accident', 'Only men’s plan', 'A myth'], 0, 'Human responsibility and divine purpose coexist.', 'intermediate'),
    mc('god-p17-5a1', 'James 1:13 teaches that:', ['God does not tempt anyone and is not the author of sin', 'God tempts everyone', 'Evil does not exist', 'God is evil'], 0, 'God ordains history without authoring sin.', 'advanced'),
  ],
}
