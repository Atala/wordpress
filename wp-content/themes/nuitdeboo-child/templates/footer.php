<footer class="content-info">
	<div class="container">
		<div class="row foot">

			<div class="col-xs-12 col-sm-4">
				<h5>#NuitDebout</h5>
				<ul class="list-unstyled list-inline">
				<?php get_template_part('templates/module', 'social'); ?>
				</ul>
				<h5>Liens</h5>
				<?php
		        if (has_nav_menu('footer_navigation')) :
		        	wp_nav_menu(['theme_location' => 'footer_navigation', 'menu_class' => 'list-unstyled']);
		        endif;
		        ?>
			</div>

			<div class="col-xs-12 col-sm-4">
				<h5>Voir aussi</h5>
				<a target="_blank" href="https://www.convergence-des-luttes.org/">
					<img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/CONVERGENCE-DES-LUTTES.png"/>
				</a>
			</div>

			<div class="col-xs-12 col-sm-4">
				<?php dynamic_sidebar('sidebar-footer'); ?>
				<h5>Contribuer</h5>
				<div class="contribute">
					<ul class="social-networks list-inline">
						<li>
							<a href="http://wiki.nuitdebout.fr" target="_blank" class="social-icons social-icons-bigger wiki">
								<i class="ic-wiki_rounded"></i>
							</a>
						</li>
						<li>
							<a href="https://github.com/nuitdebout/" target="_blank" class="social-icons social-icons-bigger github">
								<i class="ic-github_rounded"></i>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</footer>
