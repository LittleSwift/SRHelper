interface Character {
    id: string;
    name: string;
    rarity: number;
    level: number;
    promotion: number;
    icon: string;
    preview: string;
    portrait: string;
    rank_icons: string[];
    path: Path;
    element: Element;
    skills: any[];
    skill_trees: any[];
    light_cone: any;
    relics: any[];
    relic_sets: any[];
    attributes: any[];
    additions: any[];
    properties: any[];
    pos: number[];
}

interface Path {
    id: string;
    name: string;
    icon: string;
}

interface Element {
    id: string;
    name: string;
    color: `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;
    icon: string;
}

type HexDigit =
    '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'f';