package com.chess.chess_frontend.web;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class UiController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("active", "home");
        model.addAttribute("title", "Inicio");
        return "home";
    }

    @GetMapping("/jugar")
    public String jugar() {
        return "redirect:/";
    }

    @GetMapping("/partida")
    public String partida() {
        return "redirect:/";
    }

    @GetMapping("/jugar/bots")
    public String bots(Model model) {
        model.addAttribute("active", "bots");
        model.addAttribute("title", "Jugar vs Bots");
        return "bots";
    }

    @GetMapping("/partida/bots")
    public String partida(@RequestParam(required = false) String bot,
                          @RequestParam(required = false) String color,
                          @RequestParam(required = false) String elo,
                          @RequestParam(required = false) String nombre,
                          Model model) {
        model.addAttribute("active", "partida");
        model.addAttribute("title", "Partida de Ajedrez");
        model.addAttribute("bot", bot);
        model.addAttribute("color", color);
        model.addAttribute("elo", elo);
        model.addAttribute("nombreBot", nombre);
        return "partida";
    }

    @GetMapping("/jugar/bots/{nivel}")
    public String game(@PathVariable String nivel, Model model) {
        model.addAttribute("active", "bots");
        model.addAttribute("title", "Partida");
        model.addAttribute("nivel", nivel);
        return "game";
    }


    // Catch-all restringido a secciones permitidas para evitar colisiones.
    @GetMapping("/{seccion:problemas|aprender|entrenar|reglas|bases|explorador|cerrar-sesion}")
    public String section(@PathVariable String seccion, Model model) {
        model.addAttribute("active", seccion);
        model.addAttribute("title", "Sección");
        model.addAttribute("seccion", seccion);
        return "section";
    }
}