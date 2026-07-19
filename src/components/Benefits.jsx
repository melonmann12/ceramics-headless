import './Benefits.css';

const benefitsData = [
  {
    title: 'SHAPED FOR BETTER WHISKING',
    description: 'The wide, flat base and curved walls of our bowls provide the perfect surface area for vigorous whisking, resulting in a smooth, creamy foam every time.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-QUiMDjfLtTKqb9uOFjukzcRQDV4JM5mm2esGB0zs3f37RGTi8-DplssNmXtoUf80FJxLaeUGgezjoDX-X8j0am2VX4yh8jGsn38M-Eh_LKsPK3sILL3kZ_cgNrRshznSrl6kJdAmNO_fbMlY4Jj3rjN2pcmnJBawPjN1oaSb3DqrhdfTyfZ5XGhu_4RDvIzx_7Hou3BCj0qCkRJ-KCDzoeRepLJSMX_bTUTOmPa0MQc5T2Tut4hH'
  },
  {
    title: 'MADE TO FEEL GOOD IN YOUR HANDS',
    description: 'Tactile textures and ergonomic shapes designed to rest comfortably in both hands, encouraging you to slow down and savor the warmth of your tea.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBV0Y2TzDOiyMkg5Nuevx8qfBkPq1JkHA-eaxuhSzJ0N1Av5gjg019jJBQcHcZDpOHgGYND5OotqhzrCJ36Rr0ziLpiY-1W3LmnROztBjdjspC6eF4PzeuR4wSX9okqlu4r4z7731TYGaTQoiZelu2bmeslQk9zG2WWqPxNn5_xNcgDKhKJcrG1MjZGIgHVcfXnAHpBAf_BlAs5cQ9NqedEradDCbHjUx7jPN19e2NihcG7mqhVTvY'
  },
  {
    title: 'ONE-OF-A-KIND CERAMIC CHARACTER',
    description: 'Because each piece is thrown and glazed by hand, no two bowls are exactly alike. Your bowl carries the unique marks of its maker.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZtO7Jfm9fIiZR4T3afNKj1qwfQDl2m5d1FdNBb9jQBcoc9gMxp_osMUSravy8DaNI2o6gCR_ElmV596kH65U0cVbRqve4qJY5K8MHTmV6hhUDVjVWYOi2USvH2GgzCiXgBq48ISv1XIof8vEXSjg_G853vu0jr2P71RiONRyCZtMcVNb1GndjPk0EAhemcZIQIK3XUyJ_Rnh3FnMfSxoTNYof9mJ0AaaSI5fGCd6ae7W7o1TMHIpz'
  }
];

export default function Benefits() {
  return (
    <section className="benefits-section">
      <h2 className="benefits-header">THE ART OF CERAMICS</h2>
      
      <div className="benefits-grid">
        {benefitsData.map((item, index) => (
          <div key={index} className="benefit-item">
            <div className="benefit-image-container">
              <img src={item.image} alt={item.title} />
            </div>
            <h3 className="benefit-title">{item.title}</h3>
            <p className="benefit-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
