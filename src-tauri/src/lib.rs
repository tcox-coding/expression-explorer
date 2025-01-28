// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn check_is_valid_equation(equation_string: &str) -> bool {
    let mut is_valid_equation = false;

    // Remove all whitespace characters from the string
    let no_whitespace_string: String = equation_string.chars().filter(|c| !c.is_whitespace()).collect();

    // Check all characters are followed by a valid character.
    let equation_string_length: usize = no_whitespace_string.chars().count();
    for i in 0..equation_string_length {
        let current_char = (no_whitespace_string.as_bytes()[i]) as char;

        // Cannot lookahead if at the end of the string; ensure that the last character is valid.
        if i == (equation_string_length - 1) {
            if "0123456789".contains(current_char) || current_char == ')' {
                // If the last character is a constant or close parenthesis, then break.
            } else {
                // If the last character is not a constant or close parenthesis, the equation is not valid.
                return false;
            }
            break;
        }

        // Lookahead to the next character and make sure it is valid.
        let next_char = (no_whitespace_string.as_bytes()[i+1]) as char;

        if "0123456789".contains(current_char) || current_char == ')' {
            // Next character can be anything, skip.
        } else if "(^*/+-".contains(current_char) {
            // Next character must be a constant or a parenthesis.
            let next_char_constant = "0123456789".contains(next_char);
            let next_char_parenthesis = next_char == '(';
            is_valid_equation = is_valid_equation && (next_char_constant || next_char_parenthesis);
        }
    }

    println!("is_valid_equation: {}", is_valid_equation);

    // Check that all the parenthesis are valid.
    is_valid_equation = is_valid_equation && all_parenthesis_valid(no_whitespace_string);

    is_valid_equation
}

fn all_parenthesis_valid(equation_string: String) -> bool {
    for i in 0..equation_string.len() {
        let current_char: char = equation_string.as_bytes()[i] as char;
        if current_char == '(' {
            let mut oparen = 1;
            let mut cparen = 0;
            for j in i+1..equation_string.len() {
                let current_char_2 = equation_string.as_bytes()[j] as char;
                if oparen == cparen {
                    break;
                }
                if current_char_2 == '(' {
                    oparen += 1;
                } else if current_char_2 == ')' {
                    cparen += 1;
                }
            }
            println!("open: {}, closed: {}", oparen, cparen);
            if oparen != cparen {
                return false;
            }
        }
    }
    true
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![check_is_valid_equation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
