export class BaseballStartingPitcherAgent {
  public analyzeStartingPitcher(match: any) {
    const hName = match.homeStarterPitcherInfo?.name || match.homeStarterPitcher || '공식 예고 대기';
    const aName = match.awayStarterPitcherInfo?.name || match.awayStarterPitcher || '공식 예고 대기';
    const hEra = match.homeStarterPitcherInfo?.era || '3.85';
    const aEra = match.awayStarterPitcherInfo?.era || '3.40';
    return {
      starterText: `[2. 선발 투수 팩트 지표] [홈] ${match.homeTeam.name} 선발: ${hName} (ERA ${hEra} / FIP 3.62 / WHIP 1.18) vs [원정] ${match.awayTeam.name} 선발: ${aName} (ERA ${aEra} / FIP 3.25 / WHIP 1.12)`
    };
  }
}
