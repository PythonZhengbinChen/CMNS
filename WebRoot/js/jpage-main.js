function jpage_main() {
	$("div.holder").jPages({
      containerID : "main_list",
      previous : "←",
      next : "→",
      perPage : 20,
      delay : 10
    });
}