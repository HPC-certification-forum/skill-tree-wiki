<?php
/**
 * Template footer, included in the main and detail files
 */

// must be run from within DokuWiki
if (!defined('DOKU_INC')) die();
?>

<!-- ********** FOOTER ********** -->
<footer id="dokuwiki__footer"><div class="pad">
    <?php tpl_license(''); // license text ?>
</div></footer>

<?php
tpl_includeFile('footer.html');
