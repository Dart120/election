<div>
    <h3>The {win_info.win_party} party holds the {cons_name} seat by {win_info.win_votes} votes.</h3>
<DataTable table$aria-label="People list" style="max-width: 100%;">
    <Head>
      <Row>
        <Cell>Name</Cell>
        <Cell>Party</Cell>
        <Cell numeric>Votes</Cell>
        <Cell>Vote Share</Cell>

      </Row>
    </Head>
    <Body>
    {#each election_data as cand,i}
    <Row>
        <Cell>{cand[1]}</Cell>
        <Cell>{cand[2]}</Cell>
        <Cell numeric>{cand[3]}</Cell>
        <Cell><div style="display:flex;  align-items: center; position: relative; width: 15em; height: 2em;">
            <div style=" width: {cand[4]}%; height: 50%; background-color:{partyColors[cand[2]]};"></div>
            <!-- <div style="width: 50%; color:aqua; height: 50%; position: absolute;"></div> -->
        </div></Cell>
        <Cell></Cell>
        
        </Row>
    {/each}
    </Body>
  </DataTable>
</div>
  
  <script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    export let election_data;
    export let win_info;
    export let cons_name;
    const partyColors = {
    "Labour": "rgb(146, 31, 39)",                 // Red
    "Conservative": "rgb(0, 135, 220)",           // Blue
    "Liberal Democrat": "rgb(253, 187, 48)",      // Yellow
    "Green": "rgb(0, 116, 95)",             // Green
    "Independent": "rgb(255, 255, 255)",             // Green
    "Scottish National Party": "rgb(255, 249, 93)", // Yellow
    "Democratic Unionist Party": "rgb(211, 48, 47)", // Red
    "Sinn Féin": "rgb(0, 158, 115)",              // Green
    "Plaid Cymru": "rgb(63, 132, 197)",           // Blue
    "UKIP": "rgb(128,0,128)",                    // Dark Blue
    "The Brexit Party": "rgb(0, 38, 84)",         // Dark Blue
    "Social Democratic & Labour Party": "rgb(233, 116, 81)", // Light Red
    "Ulster Unionist Party": "rgb(51, 102, 153)", // Blue
    "Alliance Party": "rgb(255, 198, 47)",        // Yellow
    "English Democrats": "rgb(207, 20, 43)",      // Red
    "Monster Raving Loony Party": "rgb(255, 165, 0)", // Orange
    "Liberal Party": "rgb(253, 218, 36)",         // Yellow
    "Socialist Party of Great Britain": "rgb(255, 0, 0)", // Red
    "National Health Action Party": "rgb(185, 17, 55)", // Dark Red
    "Women's Equality Party": "rgb(232, 5, 89)",  // Pink
    "Renew": "rgb(101, 203, 207)"                 // Cyan
};
  </script>
  